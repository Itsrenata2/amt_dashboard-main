import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const DataDisplay = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/dados");
        setData(response.data);
        setError(null);
      } catch (error) {
        setError("Error fetching data");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const calcMonthlyAverageTotal = (data) => {
    const months = [
      "janeiro", "fevereiro", "marco", "abril", "maio", "junho", 
      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];

    const totalSum = data.reduce((sum, row) => {
      return sum + months.reduce((monthSum, mes) => {
        const value = parseFloat(row[mes]);
        return monthSum + (isNaN(value) ? 0 : value);
      }, 0);
    }, 0);

    const numMonths = months.length;
    const numResidueType = data.length;
    const monthlyAverage = totalSum / (numMonths * numResidueType);

    return monthlyAverage.toFixed(2); 
  };

  const processTotalYearlyData = (data) => {
    const yearlyData = data.map((row) => {
      const monthlyValues = Object.entries(row).filter(
        ([key, value]) => key !== "ano" && key !== "tipo_residuo" && !isNaN(parseFloat(value))
      );
      
      const totalYear = monthlyValues.reduce((sum, [month, value]) => sum + parseFloat(value), 0);
      return { tipo_residuo: row.tipo_residuo, totalYear };
    });

    return yearlyData;
  };

  const totalYearlyData = processTotalYearlyData(data);

  const processBarChartData = (data) => {
    const labels = data.map((row) => row.tipo_residuo);
    const totals = data.map((row) => row.totalYear);

    return {
      labels,
      datasets: [
        {
          label: "Resíduos (Anual)",
          data: totals,
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
      ],
    };
  };

  const processLineChartData = (data) => {
    const months = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const values = months.map((month) => {
      return data.reduce((sum, row) => {
        return sum + parseFloat(row[month] || 0);
      }, 0);
    });

    return {
      labels: months,
      datasets: [
        {
          label: "Evolução Mensal",
          data: values,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: true,
        },
      ],
    };
  };

  const processDoughnutChartData = (data) => {
    const labels = data.map((row) => row.tipo_residuo);
    const totals = data.map((row) => row.totalYear);

    return {
      labels,
      datasets: [
        {
          label: "Proporção de Resíduos",
          data: totals,
          backgroundColor: [
            "rgba(153, 102, 255, 0.5)", 
            "rgba(255, 159, 64, 0.5)", 
            "rgba(255, 99, 132, 0.5)", 
            "rgba(54, 162, 235, 0.5)", 
            "rgba(255, 206, 86, 0.5)", 
            "rgba(75, 192, 192, 0.5)", 
            "rgba(153, 102, 255, 0.5)", 
            "rgba(255, 159, 64, 0.5)", 
            "rgba(231, 76, 60, 0.5)", 
            "rgba(52, 152, 219, 0.5)", 
            "rgba(241, 196, 15, 0.5)", 
            "rgba(46, 204, 113, 0.5)", 
            "rgba(155, 89, 182, 0.5)", 
            "rgba(241, 196, 15, 0.5)", 
            "rgba(52, 152, 219, 0.5)"
          ],
        },
      ],
    };
  };

  const barChartData = processBarChartData(totalYearlyData);
  const lineChartData = processLineChartData(data);
  const doughnutChartData = processDoughnutChartData(totalYearlyData);

  const total = data
    .filter(item => item.tipo_residuo === "TOTAL")
    .reduce((sum, item)  => {
      return sum + Object.entries(item)
        .filter(([key, value]) => !isNaN(parseFloat(value)))
        .reduce((subSum, [key, value]) => subSum + parseFloat(value), 0);
    }, 0);

  const totalRounded = Math.round(total);

  const year = data.length > 0 ? data[0].ano : "Ano não disponível";

  const numPeople = 212583750; 

  const residuePerPerson = total / numPeople;
  const residuePerPersonRounded = residuePerPerson.toFixed(2); // Com 2 casas decimais

  const averageMonthlyTotal = calcMonthlyAverageTotal(data);

  return (
    <div className="p-6 font-sans">
      {error ? (
        <div className="text-red-500 text-center">Error: {error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="flex flex-col gap-6"> 
            {/* Period Time */}
            <div className="bg-white shadow rounded-lg p-10 content-center">
              <h3 className="text-secondary text-md font-outfit font-semibold lowercase">Ano de coleta dos dados</h3>
              <p className="text-primary text-2xl font-outfit">{year}</p> 
            </div>
            
            {/* Total Count */}
            <div className="bg-white shadow rounded-lg p-10 content-center">
              <h3 className="text-secondary text-md font-outfit font-semibold lowercase">Total de resíduos processados</h3>
              <p className="text-primary text-2xl font-outfit">
                {totalRounded}
              </p>
            </div>
          </div>

          {/* Residue Type Chart */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-secondary text-md font-outfit font-semibold lowercase">Tipos de resíduo</h3>
            <Bar data={barChartData} options={{ responsive: true }} />
          </div>

          {/* Residue Evolution Chart */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-secondary text-md font-outfit font-semibold lowercase">Evolução dos tipos de resíduo ao longo do ano</h3>
            <Line data={lineChartData} options={{ responsive: true }} />
          </div>

          {/* Residue Proportion */}
          <div className="bg-white shadow rounded-lg p-4 md:col-span-1 xl:col-span-2">
            <h3 className="text-secondary text-md font-outfit font-semibold lowercase">Proporção de Resíduos</h3>
            <Doughnut data={doughnutChartData} options={{ responsive: true }} />
          </div>

          <div className="flex flex-col gap-6">          
            {/* Residue per person */}
            <div className="bg-white shadow rounded-lg p-10 content-center">
              <h3 className="text-secondary text-md font-outfit font-semibold lowercase">Resíduo gerado por habitante</h3>
              <p className="text-primary text-2xl font-outfit">
                {residuePerPersonRounded} <span className="text-secondary text-md">/hab</span>
              </p>

            </div>

            {/* Monthly average */}
            <div className="bg-white shadow rounded-lg p-10 content-center">
              <h3 className="text-secondary text-md font-outfit font-semibold lowercase">Média Mensal Geral de Coleta</h3>
              <p className="text-primary text-2xl font-outfit">{averageMonthlyTotal} <span className="text-secondary text-md">/mês</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
