/**
 * DPO Payment Service
 * Handles DPO payment token creation and verification
 */

// DPO API endpoints
const DPO_API_URL = process.env.DPO_API_URL || 'https://secure.3gdirectpay.com';
const DPO_COMPANY_TOKEN = process.env.DPO_COMPANY_TOKEN;
const DPO_SERVICE_TYPE = process.env.DPO_SERVICE_TYPE || '5525'; // Default service type

/**
 * Create DPO payment token
 * @param {Object} paymentData - Payment information
 * @returns {Promise<Object>} DPO payment token response
 */
async function createPaymentToken(paymentData) {
  try {
    const {
      orderId,
      amount,
      currency = 'USD',
      customerEmail,
      customerFirstName,
      customerLastName,
      customerPhone,
      redirectURL,
      backURL
    } = paymentData;

    if (!DPO_COMPANY_TOKEN) {
      throw new Error('DPO Company Token is not configured');
    }

    // Prepare XML request for DPO
    const xmlRequest = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${DPO_COMPANY_TOKEN}</CompanyToken>
  <Request>createToken</Request>
  <Transaction>
    <PaymentAmount>${amount}</PaymentAmount>
    <PaymentCurrency>${currency}</PaymentCurrency>
    <CompanyRef>${orderId}</CompanyRef>
    <RedirectURL>${redirectURL}</RedirectURL>
    <BackURL>${backURL}</BackURL>
    <CompanyRefUnique>0</CompanyRefUnique>
    <PTL>5</PTL>
  </Transaction>
  <Services>
    <Service>
      <ServiceType>${DPO_SERVICE_TYPE}</ServiceType>
      <ServiceDescription>Order ${orderId}</ServiceDescription>
      <ServiceDate>${new Date().toISOString()}</ServiceDate>
    </Service>
  </Services>
  <Customer>
    <CustomerFirstName>${customerFirstName}</CustomerFirstName>
    <CustomerLastName>${customerLastName}</CustomerLastName>
    <CustomerEmail>${customerEmail}</CustomerEmail>
    <CustomerPhone>${customerPhone}</CustomerPhone>
  </Customer>
</API3G>`;

    // Make request to DPO API
    const response = await fetch(`${DPO_API_URL}/API/v6/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xmlRequest
    });

    const xmlResponse = await response.text();
    
    // Parse XML response
    const tokenMatch = xmlResponse.match(/<TransToken>(.*?)<\/TransToken>/);
    const resultMatch = xmlResponse.match(/<Result>(.*?)<\/Result>/);
    const resultExplanationMatch = xmlResponse.match(/<ResultExplanation>(.*?)<\/ResultExplanation>/);

    const result = resultMatch ? resultMatch[1] : '';
    const token = tokenMatch ? tokenMatch[1] : null;
    const explanation = resultExplanationMatch ? resultExplanationMatch[1] : '';

    if (result === '000' && token) {
      return {
        success: true,
        token: token,
        paymentURL: `${DPO_API_URL}/payv2.php?ID=${token}`,
        transactionToken: token
      };
    } else {
      return {
        success: false,
        error: explanation || 'Failed to create payment token',
        resultCode: result
      };
    }
  } catch (error) {
    console.error('DPO Payment Token Creation Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create payment token'
    };
  }
}

/**
 * Verify DPO payment transaction
 * @param {String} transactionToken - DPO transaction token
 * @returns {Promise<Object>} Payment verification response
 */
async function verifyPayment(transactionToken) {
  try {
    if (!DPO_COMPANY_TOKEN) {
      throw new Error('DPO Company Token is not configured');
    }

    const xmlRequest = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${DPO_COMPANY_TOKEN}</CompanyToken>
  <Request>verifyToken</Request>
  <TransactionToken>${transactionToken}</TransactionToken>
</API3G>`;

    const response = await fetch(`${DPO_API_URL}/API/v6/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xmlRequest
    });

    const xmlResponse = await response.text();
    
    // Parse XML response
    const resultMatch = xmlResponse.match(/<Result>(.*?)<\/Result>/);
    const resultExplanationMatch = xmlResponse.match(/<ResultExplanation>(.*?)<\/ResultExplanation>/);
    const transactionStatusMatch = xmlResponse.match(/<TransactionStatus>(.*?)<\/TransactionStatus>/);
    const transactionAmountMatch = xmlResponse.match(/<TransactionAmount>(.*?)<\/TransactionAmount>/);
    const transactionCurrencyMatch = xmlResponse.match(/<TransactionCurrency>(.*?)<\/TransactionCurrency>/);
    const companyRefMatch = xmlResponse.match(/<CompanyRef>(.*?)<\/CompanyRef>/);

    const result = resultMatch ? resultMatch[1] : '';
    const explanation = resultExplanationMatch ? resultExplanationMatch[1] : '';
    const status = transactionStatusMatch ? transactionStatusMatch[1] : '';
    const amount = transactionAmountMatch ? transactionAmountMatch[1] : '';
    const currency = transactionCurrencyMatch ? transactionCurrencyMatch[1] : '';
    const orderId = companyRefMatch ? companyRefMatch[1] : '';

    if (result === '000') {
      return {
        success: true,
        verified: true,
        status: status,
        amount: parseFloat(amount),
        currency: currency,
        orderId: orderId,
        transactionToken: transactionToken,
        message: explanation
      };
    } else {
      return {
        success: false,
        verified: false,
        error: explanation || 'Payment verification failed',
        resultCode: result
      };
    }
  } catch (error) {
    console.error('DPO Payment Verification Error:', error);
    return {
      success: false,
      verified: false,
      error: error.message || 'Failed to verify payment'
    };
  }
}

/**
 * Get payment status
 * @param {String} transactionToken - DPO transaction token
 * @returns {Promise<Object>} Payment status response
 */
async function getPaymentStatus(transactionToken) {
  try {
    if (!DPO_COMPANY_TOKEN) {
      throw new Error('DPO Company Token is not configured');
    }

    const xmlRequest = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${DPO_COMPANY_TOKEN}</CompanyToken>
  <Request>checkStatus</Request>
  <TransactionToken>${transactionToken}</TransactionToken>
</API3G>`;

    const response = await fetch(`${DPO_API_URL}/API/v6/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xmlRequest
    });

    const xmlResponse = await response.text();
    
    const resultMatch = xmlResponse.match(/<Result>(.*?)<\/Result>/);
    const statusMatch = xmlResponse.match(/<Status>(.*?)<\/Status>/);
    const explanationMatch = xmlResponse.match(/<ResultExplanation>(.*?)<\/ResultExplanation>/);

    const result = resultMatch ? resultMatch[1] : '';
    const status = statusMatch ? statusMatch[1] : '';
    const explanation = explanationMatch ? explanationMatch[1] : '';

    return {
      success: result === '000',
      status: status,
      message: explanation,
      resultCode: result
    };
  } catch (error) {
    console.error('DPO Payment Status Check Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to check payment status'
    };
  }
}

module.exports = {
  createPaymentToken,
  verifyPayment,
  getPaymentStatus
};
