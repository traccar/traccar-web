/*
 * Copyright 2014 Vitaly Litvak (vitavaque@gmail.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.traccar.web.server.model;

import com.google.gwt.user.client.rpc.IncompatibleRemoteServiceException;
import com.google.gwt.user.client.rpc.RpcTokenException;
import com.google.gwt.user.client.rpc.SerializationException;
import com.google.gwt.user.server.rpc.RPC;
import com.google.gwt.user.server.rpc.RPCRequest;
import com.google.gwt.user.server.rpc.RemoteServiceServlet;
import org.traccar.web.shared.model.ApplicationSettings;
import org.traccar.web.shared.model.User;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.List;

abstract class AOPRemoteServiceServlet extends RemoteServiceServlet {
    final Object proxy;

    public AOPRemoteServiceServlet(Class<?> iface) {
        this.proxy = Proxy.newProxyInstance(iface.getClassLoader(), new Class<?> [] { iface }, new AOPHandler(this));
    }

    class AOPHandler implements InvocationHandler {
        final Object target;

        AOPHandler(Object target) {
            this.target = target;
        }

        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            Method targetMethod = target.getClass().getMethod(method.getName(), method.getParameterTypes());
            checkAccess(targetMethod);
            checkDeviceManagementAccess(targetMethod);
            beginTransaction(targetMethod);
            try {
                return targetMethod.invoke(target, args);
            } finally {
                endTransaction(targetMethod);
            }
        }

        void checkAccess(Method method) throws Throwable {
            RequireUser requireUser = method.getAnnotation(RequireUser.class);
            if (requireUser == null) return;
            beginTransaction();
            try {
                User user = getSessionUser();
                if (user == null) {
                    throw new SecurityException("Not logged in");
                }
                if (requireUser.roles().length > 0) {
                    StringBuilder roles = new StringBuilder();
                    for (Role role : requireUser.roles()) {
                        if (roles.length() > 0) {
                            roles.append(" or ");
                        }
                        roles.append(role.toString());
                        if (role.has(user)) {
                            return;
                        }
                    }
                    throw new SecurityException("User must have " + roles + " role");
                }
            } finally {
                if (method.getAnnotation(Transactional.class) == null) {
                    endTransaction(false);
                }
            }
        }

        void checkDeviceManagementAccess(Method method) throws Throwable {
            ManagesDevices managesDevices = method.getAnnotation(ManagesDevices.class);
            if (managesDevices == null) return;
            beginTransaction();
            try {
                User user = getSessionUser();
                if (user == null) {
                    throw new SecurityException("Not logged in");
                }
                if (!user.getAdmin() && !user.getManager()) {
                    ApplicationSettings applicationSettings = getSessionEntityManager().createQuery("SELECT x FROM ApplicationSettings x", ApplicationSettings.class).getSingleResult();
                    if (applicationSettings.isDisallowDeviceManagementByUsers()) {
                        throw new SecurityException("Users are not allowed to manage devices");
                    }
                }
            } finally {
                if (method.getAnnotation(Transactional.class) == null) {
                    endTransaction(false);
                }
            }
        }

        void beginTransaction(Method method) {
            Transactional transactional = method.getAnnotation(Transactional.class);
            if (transactional == null) return;
            beginTransaction();
        }

        void beginTransaction() {
            EntityManager entityManager = getSessionEntityManager();
            if (!entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().begin();
            }
        }

        void endTransaction(Method method) throws Throwable {
            Transactional transactional = method.getAnnotation(Transactional.class);
            if (transactional == null) return;
            endTransaction(transactional.commit());
        }

        void endTransaction(boolean commit) throws Throwable {
            EntityManager entityManager = getSessionEntityManager();
            try {
                if (entityManager.getTransaction().isActive()) {
                    if (commit) {
                        try {
                            entityManager.getTransaction().commit();
                        } catch (Throwable t) {
                            entityManager.getTransaction().rollback();
                            throw t;
                        }
                    } else {
                        entityManager.getTransaction().rollback();
                    }
                }
            } finally {
                closeSessionEntityManager();
            }
        }
    }

    /**
     * <p>Taken from RemoteServiceServlet implementation from GWT 2.6.0</p>
     *
     * <p><b>IMPORTANT NOTE</b>: May need to be updated when version of GWT is changed</p>
     */
    @Override
    public String processCall(String payload) throws SerializationException {
        // First, check for possible XSRF situation
        checkPermutationStrongName();

        try {
            RPCRequest rpcRequest = RPC.decodeRequest(payload, proxy.getClass(), this);
            onAfterRequestDeserialized(rpcRequest);
            return RPC.invokeAndEncodeResponse(proxy, rpcRequest.getMethod(),
                    rpcRequest.getParameters(), rpcRequest.getSerializationPolicy(),
                    rpcRequest.getFlags());
        } catch (IncompatibleRemoteServiceException ex) {
            log(
                    "An IncompatibleRemoteServiceException was thrown while processing this call.",
                    ex);
            return RPC.encodeResponseForFailure(null, ex);
        } catch (RpcTokenException tokenException) {
            log("An RpcTokenException was thrown while processing this call.",
                    tokenException);
            return RPC.encodeResponseForFailure(null, tokenException);
        }
    }

    abstract EntityManager getSessionEntityManager();
    abstract void closeSessionEntityManager();
    abstract User getSessionUser();
}
