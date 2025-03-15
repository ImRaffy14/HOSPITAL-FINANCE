const { GoogleGenerativeAI } = require('@google/generative-ai');
const { 
    liabilities,
    revenue,
    expenses
} = require('../models/aggregation/financialAggregation')
const financialSummary = require('../models/financialSummaryModel')
const cashFlow  = require('../models/aggregation/analyticsAggregation')
const financialReport = require('../models/financialReportModel')
const insuranceClaims = require('../models/insuranceClaimsModel')


const genAI = new GoogleGenerativeAI(process.env.GEMINE_SECRET);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const financials = async () => {
    const reports = await financialReport.find({})
    const insuranceClaimSummary = await insuranceClaims.find({})
    const resultLiabilites = await liabilities()
    const resultRevenue = await revenue()
    const resultExpenses = await expenses()
    const resultAsset = await financialSummary.findOne({})
    const assets = {
        totalAssets: resultAsset.totalCash,
        receivables: resultRevenue.receivables
    }
    const equity = {
        totalEquity: (
            assets.totalAssets + assets.receivables
            )
            - 
            (resultLiabilites.operatingExpenses +
            resultLiabilites.medicalSupplies +
            resultLiabilites.medicalEquipments +
            resultLiabilites.staffAndWages)
    }
    
    const data = {
        liabilites: resultLiabilites,
        revenue: resultRevenue.monthRevenue,
        expenses: resultExpenses,
        assets,
        equity,
        financialReports: reports,
        insuranceClaims: insuranceClaimSummary,
        financialSummary: resultAsset
    }

    return JSON.stringify(data);
}


exports.prompt = async (data) => {
    try {
        const financialData = await financials()
        const prompts =  `You are an AI Decision Support System from Hospital Financial Management System 
        specializing in financial analysis. Your responses will be based solely on the provided financial data, 
        specifically the Chart of Accounts, which includes liabilities, revenue, expenses, assets, and equity.
        Here is the data you will be working with:
        *THE BUDGET ALLOCATION IS FROM FINANCIAL SUMMARY
        * THE INSURANCE CLAIMS IS BASED ON MAINTENANCE EXPENSES
        ${financialData}


        **THE USER'S QUERY IS**
        ${data}

        **Your responsibilities include:**
        * IF THE USER QUERY IS JUST A RANDOM TEXT OR NOTHING JUST RESPONSE YOU DON'T UNDERSTAND
        * Provide a clear and concise financial analysis of the hospital's current financial situation.
        * The given data is based on the hospital's financial records, including liabilities, revenue, expenses, assets, and equity
        * The given amounts is PHP pesos
        * Providing insights and analysis based on the numerical values within the provided data.
        * Answering questions related to the financial health, performance, and position of the entity represented by this data.
        * Making comparisons between different categories (e.g., revenue vs. expenses, assets vs. liabilities).
        * Offering potential implications or areas of concern based on the numbers.
        * When asked, provide numerical answers, or calculations, based on the provided JSON data.
        * If asked to perform calculations, do so, and explain the result.
        * If asked to compare categories, do so, and explain the differences.
        * Do not provide any information outside of the provided JSON data.
        `;
        console.log(financialData.financialSummary)
        const result = await model.generateContent(prompts);
        const response = result.response;
        const answer = response.candidates[0].content.parts[0].text;

        return answer
    } catch (error) {
        console.error('Error with Gemini API:', error);
        throw error
    }
}
