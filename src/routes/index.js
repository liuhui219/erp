import React, { Component } from 'react';
// import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import { Route, Redirect, Switch } from 'react-router-dom';
import TableModel from '../components/Component/Table/TableModel'
import Table from '../components/Component/Table/Table'

import AddStaff from '../components/pages/HR/AddStaff';
import AddStaff1 from '../components/pages/HR/AddStaff1';
import StaffCheck from '../components/pages/HR/StaffCheck';
import StaffCheckInfo from '../components/pages/HR/StaffCheckInfo';
import CheckRefuse from '../components/pages/HR/CheckRefuse';
import RefuseInfo from '../components/pages/HR/RefuseInfo';
import Revise from '../components/pages/HR/revise';
import inJob from '../components/pages/HR/inJob';
import InJobInfo from '../components/pages/HR/InJobInfo';
import InJobRevise from '../components/pages/HR/InJobRevise';
import TransferPosition from '../components/pages/HR/transferPosition';
import TransferCheck from '../components/pages/HR/TransferCheck';
import TransferCheckInfo from '../components/pages/HR/TransferCheckInfo';
import TransferRefuse from '../components/pages/HR/TransferRefuse';
import TransferRefuseInfo from '../components/pages/HR/TransferRefuseInfo';
import TransferHandle from '../components/pages/HR/TransferHandle';
import TransferOperation from '../components/pages/HR/TransferOperation';
import TransferRecord from '../components/pages/HR/TransferRecord';
import TransferRecordInfo from '../components/pages/HR/TransferRecordInfo';
import roleManager from '../components/pages/HR/roleManager';
import authorityManager from '../components/pages/HR/authorityManager';
import addProduct from '../components/pages/Product/addProduct';
import ProductDraft from '../components/pages/Product/ProductDraft';
import ProductRecord from '../components/pages/Product/ProductRecord';
import DraftInfo from '../components/pages/Product/DraftInfo';
import DraftEdit from '../components/pages/Product/DraftEdit';
import RecordInfo from '../components/pages/Product/RecordInfo';
import RecordEdit from '../components/pages/Product/RecordEdit';
import RecordAdd from '../components/pages/Product/RecordAdd';
import fieldManager from '../components/pages/HR/fieldManager';
import Department from '../components/pages/HR/Basics/Department'
import StaffType from '../components/pages/HR/Basics/StaffType'
import Nationality from '../components/pages/HR/Basics/Nationality'
import Nation from '../components/pages/HR/Basics/Nation'
import Card from '../components/pages/HR/Basics/Card'
import Education from '../components/pages/HR/Basics/Education'
import Degree from '../components/pages/HR/Basics/Degree'
import Company from '../components/pages/HR/Company/Company'
import CompanyUpdate from '../components/pages/HR/Company/CompanyUpdate'
import OperationLog from '../components/pages/HR/Management/OperationLog'
import User from '../components/pages/HR/Management/User'
import CodingRule from '../components/pages/HR/Management/CodingRule'

import Apply from '../components/pages/HR/Dimission/Apply'
import DepartureAudit from '../components/pages/HR/Dimission/DepartureAudit'
import DepartureAuditInfo from '../components/pages/HR/Dimission/DepartureAuditInfo'
import DimissionReject from '../components/pages/HR/Dimission/DimissionReject'
import DimissionRejectInfo from '../components/pages/HR/Dimission/DimissionRejectInfo'
import DimissionRejecteAmend from '../components/pages/HR/Dimission/DimissionRejecteAmend'
import DimissionManage from '../components/pages/HR/Dimission/DimissionManage'
import DimissionManageInfo from '../components/pages/HR/Dimission/DimissionManageInfo'
import DimissionFile from '../components/pages/HR/Dimission/DimissionFile'
import DimissionFileList from '../components/pages/HR/Dimission/DepartureFileList'
import Classify from '../components/pages/Product/Basics/Classify'
import Property from '../components/pages/Product/Basics/Property'
import Inventory from '../components/pages/Product/Basics/Inventory'
import Unit from '../components/pages/Product/Basics/Unit'
import Pack from '../components/pages/Product/Basics/Pack'

import ExpirationData from '../components/pages/Product/Basics/ExpirationData'
import AddClient from '../components/pages/Sell/ClientManagement/AddClient'
import ClientList from '../components/pages/Sell/ClientManagement/ClientList'
import ClientDetail from '../components/pages/Sell/ClientManagement/ClientDetail'
import ClientEdit from '../components/pages/Sell/ClientManagement/ClientEdit'
import Salesman from '../components/pages/Sell/Basics/Salesman'
import CustomerLevel from '../components/pages/Sell/Basics/CustomerLevel'
import OperationArea from '../components/pages/Sell/Basics/OperationArea'
import Transportation from '../components/pages/Sell/Basics/Transportation'
import Bank from '../components/pages/Pur/Basics/Bank'
import Currency from '../components/pages/Pur/Basics/Currency'
import Pay from '../components/pages/Pur/Basics/Pay'
import Receipt from '../components/pages/Pur/Basics/Receipt'
import Settle from '../components/pages/Pur/Basics/Settle'
import Tax from '../components/pages/Pur/Basics/Tax'

import TrunkM from '../components/pages/Sell/TrunkM';
import ShipmentArrangement from '../components/pages/Sell/ShipmentArrangement';
import OutFactory from '../components/pages/Sell/OutFactory';
import History from '../components/pages/Sell/History';
import HistoryInfo from '../components/pages/Sell/HistoryInfo';
import Undelivery from '../components/pages/Sell/Undelivery';
import Waitdelivery from '../components/pages/Sell/Waitdelivery';
import WaitdeliveryInfo from '../components/pages/Sell/WaitdeliveryInfo';
import WaitSure from '../components/pages/Sell/WaitSure';
import WaitSureInfo from '../components/pages/Sell/WaitSureInfo';
import AddOrder from '../components/pages/Sell/AddOrder';
import EndDeliver from '../components/pages/Sell/EndDeliver';
import EndDeliverInfo from '../components/pages/Sell/EndDeliverInfo';
import OrderDraft from '../components/pages/Sell/OrderDraft';
import OrderDraftInfo from '../components/pages/Sell/OrderDraftInfo';
import EditOrderDraft from '../components/pages/Sell/EditOrderDraft';
import OrderCheck from '../components/pages/Sell/OrderCheck';
import OrderCheckInfo from '../components/pages/Sell/OrderCheckInfo';
import OrderRefuse from '../components/pages/Sell/OrderRefuse';
import OrderRefuseInfo from '../components/pages/Sell/OrderRefuseInfo';
import OrderRefuseEdit from '../components/pages/Sell/OrderRefuseEdit';
import OrderList from '../components/pages/Sell/OrderList';
import OrderListInfo from '../components/pages/Sell/OrderListInfo';
import UndeliveryInfo from '../components/pages/Sell/UndeliveryInfo';
import WaitdeliveryEdit from '../components/pages/Sell/WaitdeliveryEdit';






export default class Router extends Component {

    render() {
        return (
            <Switch>
                <Route exact path="/erp/home" component={inJob} />
                <Route exact path="/erp/resume/:id" component={AddStaff1} />
                <Route exact path="/erp/hr-entryjob-add" component={AddStaff} />
                <Route exact path="/erp/hr-entryjob-check"  component={StaffCheck} />
                <Route exact path="/erp/hr-entryjob-info/:id" component={StaffCheckInfo} />
                <Route exact path="/erp/hr-entryjob-refuse"  component={CheckRefuse} />
                <Route exact path="/erp/hr-entryjob-RefuseInfo/:id"  component={RefuseInfo} />
                <Route exact path="/erp/hr-entryjob-Revise/:id"  component={Revise} />
                <Route exact path="/erp/hr-entryjob-injob"  component={inJob} />
                <Route exact path="/erp/hr-entryjob-InJobInfo/:id"  component={InJobInfo} />
                <Route exact path="/erp/hr-entryjob-inJobRevise/:id"  component={InJobRevise} />
                <Route exact path="/erp/hr-transferjob-check"  component={TransferCheck} />
                <Route exact path="/erp/hr-transferjob-refuse"  component={TransferRefuse} />
                <Route exact path="/erp/hr-transferjob-handle"  component={TransferHandle} />
                <Route exact path="/erp/hr-transferjob-record"  component={TransferRecord} />
                <Route exact path="/erp/hr-transferjob-TransferRecordInfo/:id"  component={TransferRecordInfo} />
                <Route exact path="/erp/hr-transferjob-transferOperation/:id"  component={TransferOperation} />
                <Route exact path="/erp/hr-transferjob-TransferCheckInfo/:id"  component={TransferCheckInfo} />
                <Route exact path="/erp/hr-transferjob-transFerRefuseInfo/:id"  component={TransferRefuseInfo} />
                <Route exact path="/erp/sys-role-manager"  component={roleManager} />
                <Route exact path="/erp/sys-permission-manager"  component={authorityManager} />
                <Route exact path="/erp/sys-fieldpermission-manager"  component={fieldManager} />
                <Route exact path="/erp/hr-transferjob-add"  component={TransferPosition} />


                <Route exact path="/erp/pro-product-add"  component={addProduct} />
                <Route exact path="/erp/pro-product-draft"  component={ProductDraft} />
                <Route exact path="/erp/pro-product-record"  component={ProductRecord} />
                <Route exact path="/erp/pro-draft-info/:id"  component={DraftInfo} />
                <Route exact path="/erp/pro-Draft-edit/:id"  component={DraftEdit} />
                <Route exact path="/erp/pro-Record-info/:id"  component={RecordInfo} />
                <Route exact path="/erp/pro-record-edit/:id"  component={RecordEdit} />
                <Route exact path="/erp/pro-add-record/:id"  component={RecordAdd} />

                <Route exact path="/erp/sale-logistics-trunk"  component={TrunkM} />
                <Route exact path="/erp/sale-ShipmentArrangement/:id"  component={ShipmentArrangement} />
                <Route exact path="/erp/sale-OutFactory/:id"  component={OutFactory} />
                <Route exact path="/erp/sale-History"  component={History} />
                <Route exact path="/erp/sale-HistoryInfo/:id"  component={HistoryInfo} />
                <Route exact path="/erp/sale-logistics-undelivery"  component={Undelivery} />
                <Route exact path="/erp/sale-UndeliveryInfo/:id"  component={UndeliveryInfo} />
                <Route exact path="/erp/sale-logistics-waitdelivery"  component={Waitdelivery} />
                <Route exact path="/erp/sale-WaitdeliveryInfo/:id"  component={WaitdeliveryInfo} />
                <Route exact path="/erp/sale-logistics-wait"  component={WaitSure} />
                <Route exact path="/erp/sale-logistics-list"  component={EndDeliver} />
                <Route exact path="/erp/sale-WaitdeliveryEdit/:id"  component={WaitdeliveryEdit} />

                <Route exact path="/erp/sale-logistics-WaitSureInfo/:id"  component={WaitSureInfo} />
                <Route exact path="/erp/sale-logistics-EndDeliverInfo/:id"  component={EndDeliverInfo} />

                <Route exact path="/erp/sale-order-add"  component={AddOrder} />
                <Route exact path="/erp/sale-order-draft"  component={OrderDraft} />
                <Route exact path="/erp/sale-OrderDraftInfo/:id"  component={OrderDraftInfo} />
                <Route exact path="/erp/sale-EditOrderDraft/:id"  component={EditOrderDraft} />
                <Route exact path="/erp/sale-order-check"  component={OrderCheck} />
                <Route exact path="/erp/sale-OrderCheckInfo/:id"  component={OrderCheckInfo} />
                <Route exact path="/erp/sale-order-refuse"  component={OrderRefuse} />
                <Route exact path="/erp/sale-OrderRefuseInfo/:id"  component={OrderRefuseInfo} />
                <Route exact path="/erp/sale-orderRefuseEdit/:id"  component={OrderRefuseEdit} />
                <Route exact path="/erp/sale-order-list"  component={OrderList} />
                <Route exact path="/erp/sale-OrderListInfo/:id"  component={OrderListInfo} />



                <Route  path="/erp/ClientEdit/:id" component={ClientEdit} />
                <Route  path="/erp/ClientDetail/:id" component={ClientDetail} />
                <Route  path="/erp/sale-customer-list" component={ClientList} />
                <Route  path="/erp/sale-customer-add" component={AddClient} />
                <Route  path="/erp/finance-setting-bank" component={Bank} />
                <Route  path="/erp/finance-setting-currencytype" component={Currency} />
                <Route  path="/erp/finance-setting-paymentclause" component={Pay} />
                <Route  path="/erp/finance-setting-receiveclause" component={Receipt} />
                <Route  path="/erp/finance-setting-settlementtype" component={Settle} />
                <Route  path="/erp/finance-setting-tax" component={Tax} />
                <Route  path="/erp/sale-setting-salesman" component={Salesman} />
                <Route  path="/erp/sale-setting-customerlvl" component={CustomerLevel} />
                <Route  path="/erp/sale-setting-salearea" component={OperationArea} />
                <Route  path="/erp/sale-setting-logisticstype" component={Transportation} />
                <Route  path="/erp/pro-setting-expirationdate" component={ExpirationData} />
                <Route  path="/erp/pro-setting-util" component={Unit} />
                <Route  path="/erp/pro-setting-packingutil" component={Pack} />

                <Route  path="/erp/pro-setting-stock" component={Inventory} />
                <Route  path="/erp/pro-setting-sku" component={Property} />
                <Route  path="/erp/pro-setting-category" component={Classify} />
                <Route  path="/erp/hr-outjob-record" component={DimissionFileList} />
                <Route  path="/erp/DimissionFile/:id" component={DimissionFile} />
                <Route  path="/erp/DimissionManageInfo/:id" component={DimissionManageInfo} />
                <Route  path="/erp/hr-outjob-handle" component={DimissionManage} />
                <Route  path="/erp/DimissionRejecteAmend/:id" component={DimissionRejecteAmend} />
                <Route  path="/erp/DimissionRejectInfo/:id" component={DimissionRejectInfo} />
                <Route  path="/erp/hr-outjob-refuse" component={DimissionReject} />
                <Route  path="/erp/DepartureAuditInfo/:id" component={DepartureAuditInfo} />
                <Route  path="/erp/hr-outjob-check" component={DepartureAudit} />
                <Route  path="/erp/hr-outjob-add" component={Apply} />
                <Route  path="/erp/sys-user-manager" component={User} />
                <Route  path="/erp/sys-setting-billscodingrule" component={CodingRule} />
                <Route  path="/erp/sys-log-log" component={OperationLog} />
                <Route  path="/erp/TableModel" component={TableModel} />
                <Route  path="/erp/Table" component={Table} />
                <Route  path="/erp/hr-setting-department" component={Department} />
                <Route  path="/erp/hr-setting-employeetype" component={StaffType} />
                <Route  path="/erp/hr-setting-nationality" component={Nationality} />
                <Route  path="/erp/hr-setting-nation" component={Nation} />
                <Route  path="/erp/hr-setting-paperstype" component={Card} />
                <Route  path="/erp/hr-setting-educationbackground" component={Education} />
                <Route  path="/erp/hr-setting-degree" component={Degree} />
                <Route  path="/erp/sys-company-info" component={Company} />
                <Route  path="/erp/CompanyUpdate/:id" component={CompanyUpdate} />
                <Route render={() => <Redirect to="/404" />} />
                <Route  component={Table} />
            </Switch>
        )
    }
}
