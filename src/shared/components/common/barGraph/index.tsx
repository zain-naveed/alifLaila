import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chart.js/auto";
import styles from "./style.module.scss";
import classNames from "classnames";
import { barChartOptions } from "shared/utils/pageConstant/partner/dashboardConstant";
import moment from "moment";
import { ChevDownIcon } from "assets";
import DatePicker from "react-datepicker";
import { GetGraphs } from "shared/services/publisher/dashboardService";

interface BarGraphProps {
  chartData: any;
}

const BarGraph = ({ chartData }: BarGraphProps) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const [chart, setChart] = useState<any>(chartData);
  const [startDate, setStartDate] = useState<any>(new Date());
  const [endDate, setEndDate] = useState<any>(new Date().getDate() + 1);
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
        }
      })
      .catch(() => {})
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
          "d-flex flex-column align-items-start gap-2 mb-3"
        )}
      >
        <label className={classNames(styles.title)}>Hard Copy Sales</label>
        <label
          htmlFor="datePicker2"
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
            id="datePicker2"
          />
        </label>
      </div>
      <Bar
        options={barChartOptions}
        data={{
          labels: chart?.labels,
          datasets: [
            {
              label: "Dataset 2",
              data: chart?.sales?.hard_copy_sales,
              backgroundColor: "rgba(24, 151, 166, 0.1)",
              borderColor: "#1897A6",
              borderWidth: 1,
              borderRadius: 6,
            },
          ],
        }}
        className={classNames(styles.chart)}
      />
    </div>
  );
};

export default BarGraph;
