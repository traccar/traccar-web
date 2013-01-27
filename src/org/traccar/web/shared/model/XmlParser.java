package org.traccar.web.shared.model;

import java.util.LinkedList;
import java.util.List;

import com.google.gwt.regexp.shared.MatchResult;
import com.google.gwt.regexp.shared.RegExp;

public class XmlParser {
	
	public static List<String> enumerateElements(String input) {
		List<String> list = new LinkedList<String>();
		
		RegExp parser = RegExp.compile("<([^/<][^<]*)>", "g");
		MatchResult result = parser.exec(input);
		while (result.getGroupCount() > 0) {
			list.add(result.getGroup(1));
			result = parser.exec(input);
		}
		
		return list;
	}
	
	public static String getElement(String input, String key) {
		
		StringBuilder pattern = new StringBuilder();
		pattern.append("<").append(key).append(">");
		pattern.append("([^<]*)");
		pattern.append("</").append(key).append(">");
		
		RegExp parser = RegExp.compile(pattern.toString());
		MatchResult result = parser.exec(input);
		if (result.getGroupCount() > 0) {
			return result.getGroup(1);
		}
		
		return null;
	}

}
