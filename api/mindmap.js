const axios = require('axios');

module.exports = async (req, res) => {
  // 设置CORS头，允许跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理OPTIONS请求（预检请求）
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 只接受POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST方法' });
  }
  
  try {
    const { prompt, model } = req.body;
    
    // 从环境变量获取API密钥
    const apiKey = process.env.VOLCANO_API_KEY;
    const secretKey = process.env.VOLCANO_SECRET_KEY;
    
    if (!apiKey || !secretKey) {
      return res.status(500).json({ error: 'API密钥未配置' });
    }
    
    // 构建请求头，可能需要根据火山方舟API要求调整
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'X-Secret-Key': secretKey
    };
    
    // 构建请求体，可能需要根据火山方舟API要求调整
    const requestBody = {
      prompt: prompt,
      model: model || 'default-model',
      // 其他参数根据火山方舟API文档添加
    };
    
    // 调用火山方舟API
    const response = await axios.post(
      'https://api.volcengine.com/v1/llm/generation', // 根据实际API地址调整
      requestBody,
      { headers }
    );
    
    // 返回API响应
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('调用AI API出错:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: '调用AI服务失败', 
      details: error.response?.data || error.message 
    });
  }
};