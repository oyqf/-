import { get, post } from './http'

export const createMenu = p => post('/createMenu', p)  //创建菜单

export const GetAccessToken = p => post('/GetAccessToken', p)   //获取AccessToken

export const GetuserID = p => post('/GetuserID', p)   //获取userID

export const apiStockorgList = p => post('/getStockorgList', p)  //获取库存组织

export const getFactory = p => post('/getFactory', p)  //获取工厂

export const apiWareHouseList = p => post('/getWareHouseList', p) //获取仓库

export const apiInventoryList = p => post('/getInventoryList', p)  //现存量

export const apigetCostPriceList = p => post('/getCostPrice', p)  //成本价

export const apigetMaterielCode = p => post('/getMaterielCode', p)  //获取物料代码

export const getMateriBom = p => post('/getMateriBom', p)   //获取BOM

export const getMateriName = p => post('/getMateriName', p)   //获取物料名称

export const apigetIBalancelist = p => post('/getInventoryBalancelist', p)   //备料查询

export const getofflineSales = p => post('/getofflineSales', p)   //线下销售

export const getRoleList = p => post('/getRoleList', p)   //获取角色列表

export const getNodeList = p => post('/getNodeList', p)   //获取节点列表

export const addRole = p => post('/addRole', p)   //添加角色

export const deleteRole = p => post('/deleteRole', p)   //删除角色

export const modifyRole = p => post('/modifyRole', p)   //修改角色包含的节点

export const getUserList = p => post('/getUserList', p)   //获取用户列表

export const modifyUser = p => post('/modifyUser', p)   //修改用户角色

export const getOnlineData = p => post('/getOnlineData', p)   //获取线上数据

export const customerFuzzySearch = p => post('/customerFuzzySearch', p)   //客户模糊搜索

export const getCustomerSummaryData = p => post('/getCustomerSummaryData', p)   //客户汇总

export const supplierFuzzySearch = p => post('/supplierFuzzySearch', p)   //供应商模糊搜索

export const getSupplierQueryData = p => post('/getSupplierQueryData', p)   //供应商查询

export const getSinglGoods = p => post('/getSinglGoods', p)   //单品查询

export const getInStorageData = p => post('/getInStorageData', p)   //到货TOP10

export const getOutputSummary = p => post('/getOutputSummary', p)   //产量汇总

export const materialOutput = p => post('/materialOutput', p)   //单个产品产量变化
