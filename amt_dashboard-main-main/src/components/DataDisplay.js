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
  const [data, setData] = useState([]); // Todos os dados
  const [filteredData, setFilteredData] = useState([]); // Dados filtrados
  const [filter, setFilter] = useState(""); // Valor do filtro selecionado
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/dados");
        setData(response.data); // Armazena todos os dados
        setFilteredData(response.data); // Exibe todos os dados inicialmente
        setError(null);
      } catch (error) {
        setError("Error fetching data");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);

    // Aplica o filtro ou mostra todos os dados
    if (selectedFilter === "") {
      setFilteredData(data); // Mostra todos os dados
    } else {
      const filtered = data.filter((item) => item.tipo_residuo === selectedFilter);
      setFilteredData(filtered); // Mostra apenas os dados filtrados
    }
  };

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

  const calcResiduePerPerson = (data) => {
    const totalPopulation = 212583750; // População usada no cálculo
    const totalResidue = data.reduce((sum, row) => {
      const values = Object.values(row).filter((value) => !isNaN(parseFloat(value)));
      return sum + values.reduce((subSum, value) => subSum + parseFloat(value), 0);
    }, 0);
    return (totalResidue / totalPopulation).toFixed(2);
  };

  const calcTotalResidueGenerated = (data) => {
    return data.reduce((sum, row) => {
      const values = Object.values(row).filter((value) => !isNaN(parseFloat(value)));
      return sum + values.reduce((subSum, value) => subSum + parseFloat(value), 0);
    }, 0).toFixed(2);
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

  const totalYearlyData = processTotalYearlyData(filteredData);

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
            "rgba(75, 192, 192, 0.5)"
          ],
        },
      ],
    };
  };

  const barChartData = processBarChartData(totalYearlyData);
  const lineChartData = processLineChartData(filteredData);
  const doughnutChartData = processDoughnutChartData(totalYearlyData);

  const year = data.length > 0 ? data[0].ano : "Ano não disponível";
  const averageMonthlyTotal = calcMonthlyAverageTotal(filteredData);
  const residuePerPerson = calcResiduePerPerson(filteredData);
  const totalResidueGenerated = calcTotalResidueGenerated(filteredData);

  return (
    <div className="p-6 font-outfit lowercase">
      {error ? (
        <div className="text-red-500 text-center">Error: {error}</div>
      ) : (
        <>
          <div className="mb-6">
            <label htmlFor="filter" className="mr-2 text-white">Filtrar por tipo de resíduo:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="" className="text-secondary lowercase">Todos</option>
              {data.map((item, index) => (
                <option key={index} value={item.tipo_residuo} className="text-secondary lowercase">
                  {item.tipo_residuo}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-full mx-auto">
            <div className="flex flex-col gap-6">
              <div className="bg-white shadow rounded-lg p-10 content-center">
                <h3 className="text-secondary">Ano de coleta</h3>
                <p className="text-primary text-2xl">{year}</p>
              </div>
              <div className="bg-white shadow rounded-lg p-10 content-center">
                <h3 className="text-secondary">Total de resíduos gerados</h3>
                <p className="text-primary text-2xl">{totalResidueGenerated} kg</p>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-secondary">Gráfico de Resíduos</h3>
              <Bar data={barChartData} options={{ responsive: true }} />
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-secondary">Evolução Mensal</h3>
              <Line data={lineChartData} options={{ responsive: true }} />
            </div>
            <div className="bg-white shadow rounded-lg row-span-2 p-4">
              <h3 className="text-secondary">Proporção de Resíduos</h3>
              <Doughnut data={doughnutChartData} options={{ responsive: true }} />
            </div>
            <div className="flex flex-col gap-6">
              <div className="bg-white shadow rounded-lg p-10 content-center">
                <h3 className="text-secondary">Média mensal geral de coleta</h3>
                <p className="text-primary text-2xl">{averageMonthlyTotal} <span className="text-secondary">/mês</span></p>
              </div>
              <div className="bg-white shadow rounded-lg p-10 content-center">
                <h3 className="text-secondary">Taxa de coleta por pessoa</h3>
                <p className="text-primary text-xl">{residuePerPerson} <span className="text-secondary">/hab</span></p>
              </div>
            </div>
            
          </div>
        </>
      )}
    </div>
  );
};
