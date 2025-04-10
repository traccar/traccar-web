import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useDispatch } from "react-redux";
import dayjs from 'dayjs';
import CatchFilter from "./components/CatchFilter";
import { useTranslation } from "../common/components/LocalizationProvider";
import PageLayout from "../common/components/PageLayout";
import ReportsMenu from "./components/ReportsMenu";
import PositionValue from "../common/components/PositionValue";
import usePositionAttributes from "../common/attributes/usePositionAttributes";
import useReportStyles from "./common/useReportStyles";
import { catchActions } from "../store";
import CatchPerVesselChart from "./CatchPerVesselChart";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import logo from "../resources/images/ocean-track-logo.png";
import html2canvas from "html2canvas";

const CatchReportPage = () => {
  const dispatch = useDispatch();
  const classes = useReportStyles();
  const t = useTranslation();
  const positionAttributes = usePositionAttributes(t);

  const catches = useSelector((state) => state.catch.items);
  const filters = useSelector((state) => state.catch.filters);

  const [columns, setColumns] = useState([
    "vesselName",
    "catchDetails",
    "totalQuantity",
    // "fishingTechnique",
    "latitude",
    "longitude",
    "catchDate",
  ]);

  const catchChartRef = useRef(null);
  const [chartBase64, setChartBase64] = useState("");
  const [catchesList, setCatchesList] = useState([]);
  const [initialCatchList, setInitialCatchList] = useState([]);
  const [imageBase64, setImageBase64] = useState("");
  const [PDFDownloaded, setPDFDownloaded] = useState("");
  const fishCatchData = useSelector((state) => state.catch.items);

  useEffect(() => {
    convertToBase64(logo, setImageBase64);
  }, []);

  useEffect(() => {
    if (fishCatchData.length === 0) {
      getFishCatchData();
    } else {
      setCatchesList(fishCatchData);
      setInitialCatchList(fishCatchData);
    }
    return () => dispatch(catchActions.clearFilters());
  }, []);

  const getFishCatchData =async () => {
    const tokenExpiration = dayjs().add(5, 'minute').toISOString();
      const tokenResponse = await fetch('/api/session/token', {
        method: 'POST',
        body: new URLSearchParams(`expiration=${tokenExpiration}`),
      });
      if (tokenResponse.ok) {
        let token = await tokenResponse.text();
        const fishRecordsResponse = await fetch(`${import.meta.env.VITE_FISHCATCH_API_BASE_URL}${import.meta.env.VITE_FISHCATCH_API_PATH}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        })
        if (fishRecordsResponse.ok) {
          let records = await fishRecordsResponse.json();
          records = records.map((r) => { return { ...r, ...{ vesselId: r.id, vesselName: r.vessel_name, catchDetails: r.details, catchDate: r.details[0].catch_date, longitude: Number(r.details[0].longitude), latitude: Number(r.details[0].latitude), totalQuantity:r.details.reduce((i,j)=>Number(i)+j.quantity,0)} } });
          dispatch(catchActions.setCatchRecords(records));
          setCatchesList(records);
          setInitialCatchList(records);
        }
      }
  }
  const convertToBase64 = (imagePath, callback) => {
    fetch(imagePath) // Fetch the image
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => callback(reader.result);
        reader.readAsDataURL(blob);
      });
  };

  const captureChart = async () => {
    const chartElement = catchChartRef.current;
    if (chartElement) {
      const canvas = await html2canvas(chartElement);
      const imageBase64 = canvas.toDataURL("image/png");
      setChartBase64(imageBase64);
      setPDFDownloaded(true);
    }
  };

  const filteredCatches = () => {
    const tempCatchesList = [...initialCatchList];
    return tempCatchesList.filter((item) => {
      return (
        filters?.vesselIds?.filter((vessel) => item.vesselId === vessel)
          ?.length &&
        filters?.speciesIds?.filter((vessel) =>
          Object.keys(item.catchDetails)
            ?.map((ele) => item.catchDetails[ele].species_name)
            ?.some((ele1) => vessel === ele1)
        )?.length &&
        item?.catchDate >= filters?.from &&
        item?.catchDate <= filters?.to
      );
    });
  };

  useEffect(() => {
    if (chartBase64 !== "" && PDFDownloaded) {
      const docDefinition = createdocDefination();
      pdfMake.createPdf(docDefinition).download("CatchReport.pdf");
    }
  }, [chartBase64, PDFDownloaded]);

  const createdocDefination = () => {
    const docDefinition = {
      content: [
        {
          table: {
            widths: ["auto", "*"],
            body: [
              [
                {
                  image: imageBase64,
                  width: 150,
                  fillColor: "#cfecf7",
                  height: 50,
                  alignment: "left",
                },
                {
                  text: "Catch Report",
                  style: "header",
                  fillColor: "#cfecf7",
                  bold: true,
                  color: "#1a237e",
                },
              ],
            ],
          },
          layout: "noBorders",
        },
        {
          text:
            filters?.from && filters?.to
              ? `From: ${filters?.from} - To: ${filters?.to}`
              : "",
          fillColor: "#cfecf7",
          bold: true,
          alignment: "center",
          color: "#1a237e",
          margin: [0, 10, 0, 0],
        },
        { text: "Catch Per Vessel", style: "subHeader", bold: true },
        {
          table: {
            widths: ["auto"],
            body: [
              [
                {
                  image: chartBase64,
                  width: 500,
                  height: 400,
                  alignment: "center",
                },
              ],
            ],
          },
          layout: {
            hLineWidth: function () {
              return 1;
            },
            vLineWidth: function () {
              return 1;
            },
            hLineColor: function () {
              return "black";
            },
            vLineColor: function () {
              return "black";
            },
          },
        },
        { text: "Catch Details", style: "subHeader", bold: true },
        {
          table: {
            headerRows: 1,
            widths: ["*", "auto", "auto", "auto", "auto", "auto"],
            body: [
              [
                { text: "Vessel Name", style: "tableheader" },
                { text: "Species", style: "tableheader" },
                { text: "Total Quantity", style: "tableheader" },
                // { text: "Fishing Technique", style: "tableheader" },
                { text: "Latitude", style: "tableheader" },
                { text: "Longitude", style: "tableheader" },
                { text: "Catch Date", style: "tableheader" },
              ],
              ...catchesList?.map((item) => [
                { text: item.vesselName, style: "tableCell" },
                {
                  text: Object.keys(item.catchDetails)
                    ?.map(
                      (ele) =>
                        `${[item.catchDetails[ele].species_name]}: ${
                          item.catchDetails[ele].quantity
                        }`
                    )
                    ?.map((fish) => fish)
                    ?.join(" "),
                  style: "tableCell",
                },
                { text: item.totalQuantity, style: "tableCell" },
                // { text: item.fishingTechnique, style: "tableCell" },
                { text: item.latitude, style: "tableCell" },
                { text: item.longitude, style: "tableCell" },
                { text: item.catchDate, style: "tableCell" },
              ]),
            ],
          },
          layout: {
            vLineColor: function (i, node) {
              return "gray"; // All vertical borders green
            },
          },
        },
      ],
      footer: function (currentPage, pageCount) {
        return {
          text: `${currentPage}/${pageCount}`,
          alignment: "right",
          margin: [0, 10, 40, 0],
        };
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [40, 15, 0, 0],
          alignment: "left",
          fillColor: "#cfecf7",
        },
        defaultStyle: { fontSize: 12 },
        tableheader: {
          fillColor: "#cfecf7",
          color: "#1a237e",
          fontSize: 12,
          bold: true,
          margin: [0, 5, 0, 5],
        },

        tableCell: { fontSize: 8, margin: [0, 5, 0, 5] },
        subHeader: {
          fontSize: 16,
          alignment: "left",
          margin: [0, 30, 0, 10],
          color: "#1a237e",
        },
      },
    };
    return docDefinition;
  };

  const handleSubmit = async (data) => {
    if (data.type === "export") {
      setPDFDownloaded(false);
      const filteredData = filteredCatches();
      setCatchesList(filteredData);
      dispatch(catchActions.setCatchRecords(filteredData));
      setTimeout(() => {
        captureChart();
      }, 1000);
    } else {
      const filteredData = filteredCatches();
      setCatchesList(filteredData);
      dispatch(catchActions.setCatchRecords(filteredData));
    }
  };

  return (
    <PageLayout
      menu={<ReportsMenu />}
      breadcrumbs={["reportTitle", "reportRoute"]}
    >
      <div className={classes.container}>
        <div className={classes.containerMain}>
          <div className={classes.header}>
            <CatchFilter
              handleSubmit={handleSubmit}
              initialCatchList={initialCatchList}
            />
          </div>
          <CatchPerVesselChart catchesList={catchesList} ref={catchChartRef} />
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((key) => (
                  <TableCell key={key}>
                    {positionAttributes[key]?.name || key}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {catchesList.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((key) => (
                    <TableCell key={key}>
                      <PositionValue
                        position={item}
                        property={item?.hasOwnProperty?.(key) ? key : null}
                        attribute={item?.hasOwnProperty?.(key) ? null : key}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageLayout>
  );
};

export default CatchReportPage;
