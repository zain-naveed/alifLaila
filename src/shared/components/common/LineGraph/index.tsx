import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import "chart.js/auto";
import styles from "./style.module.scss";
import classNames from "classnames";
import { lineChartOptions } from "shared/utils/pageConstant/partner/dashboardConstant";
import DatePicker from "react-datepicker";
import { ChevDownIcon } from "assets";
import moment from "moment";
import { GetGraphs } from "shared/services/publisher/dashboardService";
import { toastMessage } from "../toast";

interface LineGraphProps {
  chartData: any;
}

const LineGraph = ({ chartData }: LineGraphProps) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const [chart, setChart] = useState<any>(chartData);
  const [startDate, setStartDate] = useState<any>(new Date());
  const [endDate, setEndDate] = useState<any>(null);
  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      handleGetGraphData(start, end);
    }
  };

  const handleGetGraphData = (start: any, end: any) => {
    GetGraphs({
      from: moment(start).format("YYYY-MM-DD"),
      to: moment(end).format("YYYY-MM-DD"),
    })
      .then(({ data: { data, status, message } }) => {
        if (status) {
          setChart(data);
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
      })
      .finally(() => {});
  };

  useEffect(() => {
    var date = new Date();
    date.setDate(date.getDate() - 5);
    setEndDate(date);
  }, []);

  return (
    <div className={classNames(styles.cardContainer)}>
      <div
        className={classNames(
          "d-flex flex-column flex-md-row gap-2 align-items-start align-items-md-center justify-content-between w-100 mb-3 flex-wrap"
        )}
      >
        <div className={classNames("d-flex align-items-center gap-3")}>
          <label className={classNames(styles.title)}>Sales Figures</label>
          <label
            htmlFor="datePicker"
            className={classNames(
              "d-flex align-items-center gap-1",
              styles.dateLabel
            )}
          >
            {moment(startDate).format("DD MMM")} -{" "}
            {endDate ? moment(endDate).format("DD MMM") : ""}
            <ChevDownIcon className={classNames(styles.chevIcon)} />
            <DatePicker
              selected={startDate}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              selectsRange
              dropdownMode="select"
              className={classNames(styles.datePicker)}
              id="datePicker"
            />
          </label>
        </div>
        <div className={classNames("d-flex align-items-center gap-3")}>
          {/* <div className={classNames("d-flex align-items-center gap-1")}>
            <div className={classNames(styles.color, styles.primary)} />
            <label className={classNames(styles.graphLabel)}>
              Total Earnings
            </label>
          </div> */}
          <div className={classNames("d-flex align-items-center gap-1")}>
            <div className={classNames(styles.color, styles.secondary)} />
            <label className={classNames(styles.graphLabel)}>
              Books Borrowed
            </label>
          </div>
          <div className={classNames("d-flex align-items-center gap-1")}>
            <div className={classNames(styles.color, styles.green)} />
            <label className={classNames(styles.graphLabel)}>Books Buy</label>
          </div>
        </div>
      </div>
      <Line
        options={lineChartOptions}
        data={{
          labels: chart?.labels,
          datasets: [
            {
              label: "Dataset 2",
              data: chart?.sales?.soft_copy_sales?.borrow_sales,
              borderColor: "#EF437B",
              borderWidth: 2,
              backgroundColor: "white",
              pointStyle: "circle",
              pointRadius: 5.5,
              pointHoverRadius: 8,
            },
            {
              label: "Dataset 3",
              data: chart?.sales?.soft_copy_sales?.lifetime_sales,
              borderColor: "#1897A6",
              borderWidth: 2,
              backgroundColor: "white",
              pointStyle: "circle",
              pointRadius: 5.5,
              pointHoverRadius: 8,
            },
          ],
        }}
        className={classNames(styles.chart)}
      />
    </div>
  );
};

export default LineGraph;
