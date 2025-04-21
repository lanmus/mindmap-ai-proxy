module.exports = (req, res) => {
    res.status(200).json({ 
      message: "API服务正常运行中",
      endpoints: {
        mindmap: "/api/mindmap (POST)"
      }
    });
  };