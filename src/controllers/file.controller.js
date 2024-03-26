const { getFileBufferService } = require("../services/file.service")

const getFileBuffer = async (req, res, next) => {
	try {
		const data = await getFileBufferService(req.params);

		res.status(data.status).json({ data: data.data });
	} catch (error) {
		next(error);
	}
}

module.exports = {getFileBuffer}