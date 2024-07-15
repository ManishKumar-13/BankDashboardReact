import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import './App.css';

const App = () => {
  const [homeValue, setHomeValue] = useState(3800);
  const [downPayment, setDownPayment] = useState(2300);
  const [interestRate, setInterestRate] = useState(5);
  const [tenure, setTenure] = useState(5);

  const [loanAmount, setLoanAmount] = useState(homeValue - downPayment);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPrincipal, setTotalPrincipal] = useState(0);

  const chartRef = useRef(null);

  useEffect(() => {
    setLoanAmount(homeValue - downPayment);
  }, [homeValue, downPayment]);

  useEffect(() => {
    const totalLoanMonths = tenure * 12;
    const interestPerMonth = interestRate / 100 / 12;

    const monthlyPayment =
      (loanAmount *
        interestPerMonth *
        (1 + interestPerMonth) ** totalLoanMonths) /
      ((1 + interestPerMonth) ** totalLoanMonths - 1);

    setMonthlyPayment(monthlyPayment);

    const totalPaid = monthlyPayment * totalLoanMonths;
    const totalInterest = totalPaid - loanAmount;
    setTotalInterest(totalInterest);
    setTotalPrincipal(loanAmount);
  }, [loanAmount, interestRate, tenure]);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      const chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Principal Amount', 'Total Interest'],
          datasets: [
            {
              label: 'Principal vs Interest',
              data: [totalPrincipal, totalInterest],
              backgroundColor: ['#FF6384', '#36A2EB'],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  const label = tooltipItem.label ?? '';
                  const value = tooltipItem.raw ?? 0;
                  return `${label}: $${value.toLocaleString()}`;
                },
              },
            },
          },
        },
      });

      return () => {
        chartInstance.destroy();
      };
    }
  }, [totalPrincipal, totalInterest]);

  const updateHomeValue = (e) => {
    const value = parseInt(e.target.value);
    setHomeValue(value);
    if (downPayment > value) {
      setDownPayment(value);
    }
  };

  const updateDownPayment = (e) => {
    const value = parseInt(e.target.value);
    setDownPayment(value);
    setLoanAmount(homeValue - value);
  };

  const updateInterestRate = (e) => {
    setInterestRate(parseFloat(e.target.value));
  };

  const updateTenure = (e) => {
    setTenure(parseInt(e.target.value));
  };

  return (
    <div className="flex-container">
      <div className="controls">
        <h1 className="title">Mortgage Calculator</h1>
        <div className="control">
          <label>Home Value:</label>
          <input
            type="range"
            min="1000"
            max="10000"
            step="100"
            value={homeValue}
            onChange={updateHomeValue}
          />
          <div className="range-label">${homeValue.toLocaleString()}</div>
        </div>
        <div className="control">
          <label>Down Payment:</label>
          <input
            type="range"
            min="0"
            max={homeValue}
            step="100"
            value={downPayment}
            onChange={updateDownPayment}
          />
          <div className="range-label">${downPayment.toLocaleString()}</div>
        </div>
        <div className="control">
          <label>Loan Amount:</label>
          <progress value={loanAmount} max={homeValue}></progress>
          <div className="range-label">${loanAmount.toLocaleString()}</div>
          {/* <div className="range-min-max">
            <span>${0}</span>
            <span>${homeValue.toLocaleString()}</span>
          </div> */}
        </div>
        <div className="control">
          <label>Interest Rate (%):</label>
          <input
            type="range"
            min="2"
            max="18"
            step="0.1"
            value={interestRate}
            onChange={updateInterestRate}
          />
          <div className="range-label">{interestRate}%</div>
        </div>
        <div className="control">
          <label>Tenure (years):</label>
          <select value={tenure} onChange={updateTenure}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
            <option value={30}>30</option>
          </select>
        </div>
      </div>
      <div className="chart-container">
        <div className="chart-card">
          <h2>Financial Breakdown</h2>
          <canvas ref={chartRef} />
          <div className="monthly-payment">
            <p>Monthly Payment</p>
            <p className="payment-amount">${monthlyPayment.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
