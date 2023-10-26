const response = require('../response');
const httpStatus = require('http-status');
const helper = require('../utils/helper');
const { PRODUCT } = require('../constant/endpoint');

exports.getProduct = async (req, res) => {
  try {
    let url = PRODUCT.URL;
    if (req.params?.categoryName) {
      url = `${PRODUCT.CATEGORY_URL}/${req.params?.categoryName}`;
    } else if (req.query?.productId) {
      url = `${url}/${req.query?.productId}`;
    }
    const allProducts = await helper.fetchData(url);
    return response.success(req, res, { msgCode: 'SCC0001', data: allProducts }, httpStatus.OK);
  } catch (err) {
    return response.error(req, res, { msgCode: 'ERR0001' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
};
