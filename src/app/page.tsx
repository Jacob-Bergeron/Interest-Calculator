'use client'
import Image from "next/image";
import React from "react";
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)


export default function Home() {

  const [initialDeposit, setInitialDeposit] = React.useState("5000")
  const [yearsToSave, setYearsToSave] = React.useState("5")
  const [ratePercentage, setRatePercentage] = React.useState(5)
  const [contributionAmount, setContributionAmount] = React.useState("100")
  const [compoundFrequency, setCompoundFrequency] = React.useState("Monthly")

  const [chartData, setChartData] = React.useState<number[]>([])
  const [labelData, setLabelData] = React.useState<number[]>([])


  //* Chart 
  const data = {
    labels: labelData,

    datasets: [
      {
        label: "Total Balance",
        data: chartData,
        borderColor: 'rgb(11, 143, 9)', // line color
        backgroundColor: 'rgba(45, 195, 28, 0.24)', // point color
        fill: true,
        pointHoverBackgroundColor: 'rgb(226, 24, 24)',
        tension: 0.1,
      }
    ]
  }


  const options = {
    responsive: true,
  };



  //* Function to be called when "submit" is clicked
  function handleClick() {
    const timeInYears = +yearsToSave // How many years we want to save
    perYear(timeInYears)
  }

  //* Function to put data into array   
  function perYear(t: number) {
    const chartDataHolder: number[] = []
    const labelDataHolder: number[] = []
    const currentYear = new Date().getFullYear()

    for (let i = 0; i <= t; i++) {
      chartDataHolder.push(compoundInterest(i))
      labelDataHolder.push(i + currentYear)
    }

    setChartData(chartDataHolder)
    setLabelData(labelDataHolder)
  }

  //* Function for calculating the compound interest
  function compoundInterest(t: number): number {

    var totalAmount: number;
    const principal = +initialDeposit // Initial deposit
    const rate = ratePercentage * 0.01
    var compoundingFrequency: number; // times compounded in a year
    const monthlyContribution = +contributionAmount // how much to contribute each month

    // If the compounding frequency is "Yearly" calculate the final value this way.
    if (compoundFrequency == "Yearly") {
      compoundingFrequency = 1

      const base = 1 + rate / compoundingFrequency
      const totalPeriods = t * compoundingFrequency; // Total compounding periods (n * t)

      const principalGrowth = principal * Math.pow(base, totalPeriods);

      // Growth of monthly contributions
      let contributionsGrowth = 0;
      for (let month = 1; month <= t * 12; month++) {
        const remainingTime = t - month / 12; // Remaining time in years for each contribution
        contributionsGrowth += monthlyContribution * Math.pow(base, remainingTime);
      }
      // Total amount
      totalAmount = principalGrowth + contributionsGrowth
    }
    // If the compounding frequency is "Monthly" calculate the compounding interest this way. 
    else {
      compoundingFrequency = 12

      const base = 1 + rate / compoundingFrequency
      const exponent = t * compoundingFrequency
      const principalGrowth = principal * (base ** exponent)

      const contributionGrowth = monthlyContribution * (((base ** exponent) - 1) / (rate / compoundingFrequency))

      // Total amount
      totalAmount = principalGrowth + contributionGrowth
    }
    // Final return 
    return parseFloat(totalAmount.toFixed(2))
  }


  //* onChange Functions
  //* =====================
  const handleChangeInitialDeposit = (e: any) => {
    const inputValue = e.target.value;
    // Initial deposit must be <= 1,000,000
    const maxValue = 1000000
    // Use regex to allow only digits
    if (/^\d*$/.test(inputValue) && inputValue <= maxValue) {
      setInitialDeposit(inputValue); // Update state only if input is valid
    }
  };

  const handleChangeYearsToSave = (e: any) => {
    const inputValue = e.target.value;
    // Years to save must be between 1 and 50
    const maxValue = 50
    const minValue = 1
    // Use regex to allow only digits
    if (/^\d*$/.test(inputValue) && inputValue <= maxValue) {
      setYearsToSave(inputValue); // Update state only if input is valid
    }
  };

  const handleChangeRatePercentage = (e: any) => {
    const inputValue = e.target.value;
    // Rate Percentage must be between 0 and 50
    const maxValue = 50
    const minValue = 1
    // Use regex to allow only digits
    if (/^\d*$/.test(inputValue) && inputValue <= maxValue) {
      setRatePercentage(inputValue); // Update state only if input is valid
    }
  };

  const handleChangeContributionAmount = (e: any) => {
    const inputValue = e.target.value;
    const maxValue = 100000
    // Use regex to allow only digits
    if (/^\d*$/.test(inputValue) && inputValue <= maxValue) {
      setContributionAmount(inputValue); // Update state only if input is valid
    }
  };

  const handleChangeCompundFrequency = (e: any) => {
    const inputValue = e.target.value;
    setCompoundFrequency(inputValue)
  };


  return (
    <div className="page">

      <div className="main-box">

        <div className="invest-box">

          <div className="header">
            <h1>Investment Details</h1>
          </div>

          <div className="details">

            <div>
              <label htmlFor="initial-deposit-id" >Initial Deposit</label>
              <input id="initial-deposit-id" type="text" inputMode="numeric" placeholder="$" value={initialDeposit} onChange={handleChangeInitialDeposit} required />
            </div>

            <div>
              <label htmlFor="years-to-save-id">Years to save</label>
              <input id="years-to-save-id" type="text" placeholder="Years" value={yearsToSave} onChange={handleChangeYearsToSave} required />
            </div>

            <div>
              <label htmlFor="estimated-rate-of-return-id">Estimated rate of return</label>
              <input id="estimated-rate-of-return-id" type="text" placeholder="%" value={ratePercentage} onChange={handleChangeRatePercentage} required />
            </div>

            <div>
              <label htmlFor="contribution-amount-id">Monthly contribution amount</label>
              <input id="contribution-amount-id" type="text" placeholder="$" value={contributionAmount} onChange={handleChangeContributionAmount} required />
            </div>

            <div>
              <label htmlFor="compound-frequency-id">Compound frequency</label>
              <select onChange={handleChangeCompundFrequency}>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            <div>
              <button onClick={(e) => handleClick()}>Submit</button>
            </div>

          </div>
        </div>

        <div className="graphbox">
          <Line data={data} options={options} />
        </div>

      </div>

    </div>
  );
}
