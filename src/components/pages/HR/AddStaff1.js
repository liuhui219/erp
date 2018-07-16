/* @flow */

import React, { Component } from 'react';
import './hr.less';
import { Form, Icon, Input, Button, Checkbox, message, Spin,Upload,DatePicker,Radio,Select,Tabs,Table,Modal,Tooltip,Popconfirm } from 'antd';
import globals from '../../unit';
import { connect } from 'react-redux';
import Form1 from './modalForm/form1';
import Form2 from './modalForm/form2';
import Form3 from './modalForm/form3';
import Form4 from './modalForm/form4';
import Form5 from './modalForm/form5';
import Form6 from './modalForm/form6';
import moment from 'moment';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Option, OptGroup } = Select;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
var arr = [];
class PriceInput extends React.Component {
  constructor(props) {
    super(props);

    const value = props.value || {};
    this.state = {
      school: value.school || '',
      subject: value.subject || '',
    };
  }
  componentDidMount(){ 
  }
 
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
    }
  }
  handleNumberChange = (e) => {
    const school = e.target.value;

    if (!('value' in this.props)) {
      this.setState({ school });
    }
    this.triggerChange({ school });
  }
  handleCurrencyChange = (e) => {
    const subject = e.target.value;

    if (!('value' in this.props)) {
      this.setState({ subject });
    }
    this.triggerChange({ subject });
  }
  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }
  render() {
    const state = this.state;
    return (
      <span style={{display:'flex',marginTop:4}}>
        <Input onChange={this.handleNumberChange} value={state.school} style={{marginRight:5}} placeholder="请输入学校" />
        <Input onChange={this.handleCurrencyChange} value={state.subject} placeholder="请输入专业" />
      </span>
    );
  }
}

class Selects extends React.Component {
  constructor(props) {
    super(props);

    const value = props.value || {};
    this.state = {
      gj: value.gj || '',
      mz: value.mz || '',
    };
  }
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
    }
  }
  handleNumberChange = (e) => {
    const gj = e;

    if (!('value' in this.props)) {
      this.setState({ gj });
    }
    this.triggerChange({ gj });
  }
  handleCurrencyChange = (e) => {
    const mz = e;

    if (!('value' in this.props)) {
      this.setState({ mz });
    }
    this.triggerChange({ mz });
  }
  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }
  render() {
    const state = this.state;
    return (
      <span style={{display:'flex',marginTop:4}}>
        <Select
             style={{marginRight:5}}
             placeholder="请选择国籍"
             onChange={this.handleNumberChange}
             defaultValue={state.gj}
        >
          {this.props.nationTypeList.map((data,i)=>{
            return <Option key={i} value={data.id}>{data.name}</Option>
          })}
        </Select>
        <Select
             placeholder="请选择民族"
             onChange={this.handleCurrencyChange}
             defaultValue={state.mz}
        >
          {this.props.ethnicTypeList.map((data,i)=>{
            return <Option key={i} value={data.id}>{data.name}</Option>
          })}
        </Select>
      </span>
    );
  }
}

class AddStaff1 extends Component {
  constructor() {
    super();
    this.state={
      loading: false,
      data:'',
      educationTypeList:[{}],
      departmentTypeList:[{}],
      employeeTypeList:[{}],
      ethnicTypeList:[{}],
      nationTypeList:[{}],
      papersTypeList:[{}],
      positionTypeList:[{}],
      educationTypeList:[{}],
      headResourceKey:'',
      visible1:false,
      visible2:false,
      visible3:false,
      visible4:false,
      visible5:false,
      visible6:false,
      key:1,
      data1:[],
      data2:[],
      data3:[],
      data4:[],
      data5:[],
      data6:[],
      modalTitle:'新增学习经历',
      spinning:true,
      tip:'加载中...',
      imgs:''

    }
  }

  componentDidMount(){
    this.getData();
    this.getLzData();
  }
  getLzData(){
    var that = this;
    console.log(this)
    fetch(globals.url.url+'/hr/employee/showPend?id='+this.props.match.params.id, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      if(result.code == 0){
        that.setState({
          data:result.result,
          spinning:false,
          data1:JSON.parse(result.result.learningExperience),
          data2:JSON.parse(result.result.workExperience),
          data6:JSON.parse(result.result.socialRelation),
          data5:JSON.parse(result.result.contractRecord),
          imageUrl:globals.url.url+'/common/file/download?key='+result.result.headResourceKey
        })
        console.log("xxxxxxxxxxxxxxx")
        console.log(that.state.data)
        var obj = {name:'员工复职-'+that.state.data.name,menuKey:'resume/'+ that.props.match.params.id,key:'/erp/resume'};
        that.props.dispatch({ type: 'INCREMENT' ,text:obj});
        
      }else if(result.code == 100500){
          that.props.history.push({pathname: '/login',});
          message.warning('登录失效，请重新登录');
      }else{
        message.warning(result.message);
        that.setState({
          spinning:false,
        })
      }
    }).catch((error) => {
      message.warning('加载失败，请刷新重试');
      that.setState({
        spinning:false,
      })
    });
  }



  getData(){
    var that = this;
    fetch(globals.url.url+'/hr/employee/show', {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){
         that.setState({
           data:result.result,
           educationTypeList:result.result.educationTypeList,
           departmentTypeList:result.result.departmentTypeList,
           employeeTypeList:result.result.employeeTypeList,
           ethnicTypeList:result.result.ethnicTypeList,
           nationTypeList:result.result.nationTypeList,
           papersTypeList:result.result.papersTypeList,
           positionTypeList:result.result.positionTypeList,
           educationTypeList:result.result.educationTypeList,
           spinning:false,
         })
      }else if(result.code == 100500){
          that.props.history.push({pathname: '/login',});
          message.warning('登录失效，请重新登录');
      }else{
        message.warning(result.message);
        that.setState({
          spinning:false,
        })
      }
    }).catch((error) => {
      message.warning('加载失败，请刷新重试');
      that.setState({
        spinning:false,
      })
    });
  }


  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload = (file) => {
    // const isJPG = file.type === 'image/jpeg';
    // if (!isJPG) {
    //   message.error('You can only upload JPG file!');
    // }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2M!');
    }
    return isLt2M;
  }


  handleChange = (info) => {
    console.log(info)
    if (info.file.status === 'uploading') {
      this.setState({ loading: true,headResourceKey:'' });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
        headResourceKey:info.file.response.result
      }));
    }
  }

  handleSubmit = (e) => {
    var that = this;
   e.preventDefault();
   if(this.state.headResourceKey == ''){
     message.warning('请上传头像');
   }else{
     this.props.form.validateFields((err, values) => {
       if (!err) {
         that.state.employeeTypeList.map((data,i)=>{
           if(data.name == values.prefix){
             values.prefix = data.id
           }
         })

         that.state.papersTypeList.map((data,i)=>{
           if(data.name == values.prefixs){
             values.prefixs = data.id
           }
         })

         that.setState({
           spinning:true,
           tip:'数据保存中...'
         })

         console.log(values)
         var obj = {
           headResourceKey : that.state.headResourceKey,
           name : values.name,
           sex : values.radio,
           birthday : values.birthday.format('YYYY-MM-DD'),
           nativePlace : values.nativePlace,
           hiredate : values.hiredate.format('YYYY-MM-DD'),
           phoneNumber : values.phoneNumber,
           departmentId : values.departmentId,
           positionId : values.positionId,
           school : values.school.school,
           professional : values.school.subject,
           educationId : values.educationTypeList,
           email : values.email,
           wechat : values.wechat,
           employeeId : values.prefix,
           number : values.employeeId,
           papersId : values.prefixs,
           papersNumber : values.papersId,
           address : values.address,
           nationId : values.guoji.gj,
           ethnicId : values.guoji.mz,
           learningExperience:JSON.stringify(that.state.data1),
           workExperience:JSON.stringify(that.state.data2),
           contractRecord:JSON.stringify(that.state.data5),
           socialRelation:JSON.stringify(that.state.data6)
         }

         that.send(obj);
       }
     });
   }
 }

 send(obj){
   var that = this;
   fetch(globals.url.url+'/hr/employee/add', {
     method: 'POST',
     credentials: 'include',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       "employee": obj
     })
   }).then(function(response) {
     return response.json();
   }).then(function(result) {
     console.log(result)
     if(result.code == 0){
       that.props.form.resetFields();
       message.success('保存成功');
       that.setState({
         data1:[],
         data2:[],
         data5:[],
         data6:[],
         spinning:false,
       })
     }else{
       message.warning(result.message);
       that.setState({
         spinning:false,
         tip:'数据保存中...'
       })
     }
   }).catch((error) => {
     message.warning('加载失败，请刷新重试');
     that.setState({
       spinning:false,
       tip:'数据保存中...'
     })
   });
 }

 check = (rule, value, callback) => {
   console.log(value)
    if (value.school === '') {
      callback('学校不能为空');
    }else if(value.subject === ''){
      callback('专业不能为空');
    }else if(value.school === '' && value.subject === ''){
      callback('学校/专业不能为空');
    }else{
      callback();
    }

  }

  checkSlect = (rule, value, callback) => {
    if (value.gj === '请选择国籍') {
      callback('国籍不能为空');
    }else if(value.mz === '请选择民族'){
      callback('民族不能为空');
    }else if(value.gj === '请选择国籍' && value.mz === '请选择民族'){
      callback('国籍/专民族不能为空');
    }else{
      callback();
    }
  }

  handleOk = (e) => {
    console.log(e);

  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible1: false,
    });
  }

  tabCallback(key){
     this.setState({
       key:key
     })
  }

  addBtn(){
    if(this.state.key == 1){
      this.setState({
        visible1:true,
        modalTitle:'新增学习经历'
      })
    }
    if(this.state.key == 2){
      this.setState({
        visible1:true,
        modalTitle:'新增工作经历'
      })
    }

    if(this.state.key == 5){
      this.setState({
        visible1:true,
        modalTitle:'新增劳务合同'
      })
    }
    if(this.state.key == 6){
      this.setState({
        visible1:true,
        modalTitle:'新增社会关系'
      })
    }
  }

  handleSubmits = (e) => {
    var that = this;
    if(this.state.key == 1){
      this.refs.form1.validateFields((err, values) => {
        if (!err) {

          that.state.educationTypeList.map((data,i)=>{
            if(data.id == values.Education){
              values.id = data.id;
              values.Education = data.name;
            }
          })
          var obj = {
            key:that.state.data1.length,
            index:that.state.data1.length+1,
            startTime:values.time[0].format('YYYY-MM-DD'),
            endTime:values.time[1].format('YYYY-MM-DD'),
            schools:values.schools,
            major:values.major,
            certificate:values.certificate,
            Education:values.Education,
            id:values.id,
            Academic:values.Academic
          }
          console.log('Received values of form: ', values);
          arr.push(obj)

          that.setState({
            visible1:false,
            data1:arr
          })
        }
      });
    }

    if(this.state.key == 2){
      this.refs.form2.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          var arr = that.state.data2;
          var obj = {
            key:that.state.data2.length,
            index:that.state.data2.length+1,
            startTime:values.time[0].format('YYYY-MM-DD'),
            endTime:values.time[1].format('YYYY-MM-DD'),
            company:values.company,
            job:values.job,
            master:values.master,
            reterence:values.reterence,
            phoneNumber:values.phoneNumber
          }
          arr.push(obj);
          that.setState({
            data2:arr,
            visible1:false,
          })
        }
      })
    }

    if(this.state.key == 5){
      this.refs.form5.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          var arr = that.state.data5;
          var obj = {
            key:that.state.data2.length,
            index:that.state.data2.length+1,
            startTime:values.time[0].format('YYYY-MM-DD'),
            endTime:values.time[1].format('YYYY-MM-DD'),
            contractType:values.contractType,
            contractPeriod:values.contractPeriod,
            contractStatus:values.contractStatus,
          }
          arr.push(obj);
          that.setState({
            data5:arr,
            visible1:false,
          })
        }
      })
    }

    if(this.state.key == 6){
      this.refs.form6.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          var arr = that.state.data6;
          if(values.isEmergencyContact){
            values.isEmergencyContact = '是'
          }else{
            values.isEmergencyContact = '否'
          }
          var obj = {
            key:that.state.data6.length,
            index:that.state.data6.length+1,
            relation:values.relation,
            name:values.name,
            isEmergencyContact:values.isEmergencyContact,
            job:values.job,
            phoneNumber:values.phoneNumber,
            profession:values.profession
          }
          arr.push(obj);
          that.setState({
            data6:arr,
            visible1:false,
          })
        }
      })
    }

  }

  delList(data,i){
    console.log(i)
    var info = this.state.data1
    info.splice(i,1);
    this.setState({
      data1:info
    })
  }

  delList1(data,i){
    console.log(i)
    var info = this.state.data2
    info.splice(i,1);
    this.setState({
      data2:info
    })
  }

  delList5(data,i){
    console.log(i)
    var info = this.state.data5
    info.splice(i,1);
    this.setState({
      data5:info
    })
  }

  delList6(data,i){
    console.log(i)
    var info = this.state.data6
    info.splice(i,1);
    this.setState({
      data6:info
    })
  }






  render() {
    var that = this;
    const data = this.state.data;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'upload'} />
        <div className="ant-upload-text"></div>
      </div>
    );
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: this.state.employeeTypeList[0]['name'],
    })(
      <Select style={{ width: 95 }}>
        {this.state.employeeTypeList.map((data,i)=>{
          return <Option key={i} value={data.name}>{data.name}</Option>
        })}
      </Select>
    );
    const prefixSelectors = getFieldDecorator('prefixs', {
      initialValue: data.papersId,
    })(
      <Select style={{ width: 95 }}>
        {this.state.papersTypeList.map((data,i)=>{
          return <Option key={i} value={data.id}>{data.name}</Option>
        })}
      </Select>
    );
    const imageUrl = this.state.imageUrl;
    const columns1 = [{
      width: 50,
      dataIndex: 'index',
      key: 'index',
      render: (text, record,i) => (
                <span>{i+1}</span>
            )
    }, {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    }, {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    }, {
      title: '学校/培训机构',
      dataIndex: 'schools',
      key: 'schools',
    }, {
      title: '专业/培训课程',
      dataIndex: 'major',
      key: 'major',
    }, {
      title: '取得证书',
      dataIndex: 'certificate',
      key: 'certificate',
    }, {
      title: '学历',
      dataIndex: 'Education',
      key: 'Education',
    }, {
      title: '学位',
      dataIndex: 'Academic',
      key: 'Academic',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record,i) => (
                <Popconfirm title="你确定删除吗？" onConfirm={this.delList.bind(this, record,i)}  okText="确定" cancelText="取消">
                  <Tooltip title="删除">
                    <span className="account-table-title" style={{cursor:'pointer'}}>
                      <Icon type="close-circle" />
                    </span>
                  </Tooltip>
                </Popconfirm>

            )
    }];
    const columns2 = [{
      width: 50,
      dataIndex: 'index',
      key: 'index',
      render: (text, record,i) => (
                <span>{i+1}</span>
            )
    }, {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    }, {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    }, {
      title: '公司',
      dataIndex: 'company',
      key: 'company',
    }, {
      title: '职位',
      dataIndex: 'job',
      key: 'job',
    }, {
      title: '离职原因',
      dataIndex: 'master',
      key: 'master',
    }, {
      title: '证明人',
      dataIndex: 'reterence',
      key: 'reterence',
    }, {
      title: '联系电话',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record,i) => (
                <Popconfirm title="你确定删除吗？" onConfirm={this.delList1.bind(this, record,i)}  okText="确定" cancelText="取消">
                  <Tooltip title="删除">
                    <span className="account-table-title" style={{cursor:'pointer'}}>
                      <Icon type="close-circle" />
                    </span>
                  </Tooltip>
                </Popconfirm>

            )
    }];

    const columns5 = [{
      width: 50,
      dataIndex: 'index',
      key: 'index',
      render: (text, record,i) => (
                <span>{i+1}</span>
            )
    }, {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    }, {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    }, {
      title: '合同类型',
      dataIndex: 'contractType',
      key: 'contractType',
    }, {
      title: '合同期限',
      dataIndex: 'contractPeriod',
      key: 'contractPeriod',
    }, {
      title: '合同状态',
      dataIndex: 'contractStatus',
      key: 'contractStatus',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record,i) => (
                <Popconfirm title="你确定删除吗？" onConfirm={this.delList5.bind(this, record,i)}  okText="确定" cancelText="取消">
                  <Tooltip title="删除">
                    <span className="account-table-title" style={{cursor:'pointer'}}>
                      <Icon type="close-circle" />
                    </span>
                  </Tooltip>
                </Popconfirm>

            )
    }];

    const columns6 = [{
      width: 50,
      dataIndex: 'index',
      key: 'index',
      render: (text, record,i) => (
                <span>{i+1}</span>
            )
    }, {
      title: '关系',
      dataIndex: 'relation',
      key: 'relation',
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '职业',
      dataIndex: 'profession',
      key: 'profession',
    }, {
      title: '工作单位',
      dataIndex: 'job',
      key: 'job',
    }, {
      title: '是否紧急联系人',
      dataIndex: 'isEmergencyContact',
      key: 'isEmergencyContact',
    }, {
      title: '电话',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record,i) => (
                <Popconfirm title="你确定删除吗？" onConfirm={this.delList6.bind(this, record,i)}  okText="确定" cancelText="取消">
                  <Tooltip title="删除">
                    <span className="account-table-title" style={{cursor:'pointer'}}>
                      <Icon type="close-circle" />
                    </span>
                  </Tooltip>
                </Popconfirm>

            )
    }];
    
    return (
      <div className="PageMain">
        <Spin size="large" tip={this.state.tip} spinning={this.state.spinning}>
         <div className='page_add_input'>
         <Form className="page_from" style={{width: '100%'}} onSubmit={this.handleSubmit}>
            <div className="page_add_input_btn">
               <li>信息录入</li>
               <div className="page_add_input_btn_right">
                   <Button type="primary" icon="dvt-salesOrder">
                     批量导入
                   </Button>
                   <Button type="primary" icon="close-square-o">
                     取消
                   </Button>
                   <Button type="primary" htmlType="submit" icon="save">
                     保存
                   </Button>
               </div>
            </div>
            <div className="page_add_input_main">
                   <div className="page_add_input_main_form" style={{width:'28%'}}>
                       <div className="ant-row ant-form-item" style={{marginBottom:15}}>
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label className="ant-form-item-required" title="头像">头像</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <Upload
                                name="file"
                                accept='image'
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action={globals.url.url+'/common/file/upLoad'}
                                withCredentials={true}
                                data={{'publicType':2}}
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleChange}
                              >
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{width:90}} /> : uploadButton}
                              </Upload>
                          </div>
                       </div>

                       <FormItem
                          {...formItemLayout}
                          label="姓名"
                        >
                          {getFieldDecorator('name', {
                            rules: [{
                              required: true,whitespace:true, message: '请输入姓名!',
                            }],
                            initialValue:data.name
                          })(
                            <Input placeholder="请输入姓名" />
                          )}
                       </FormItem>
                       <FormItem
                          {...formItemLayout}
                          label="性别"
                        >
                        {getFieldDecorator('radio',{
                          rules: [{
                            required: true, message: '请选择性别!',
                          }],
                          initialValue:data.sex+''
                        })(
                            <RadioGroup>
                              <Radio value="1">男</Radio>
                              <Radio value="0">女</Radio>
                            </RadioGroup>
                          )}
                       </FormItem>
                       <FormItem
                          {...formItemLayout}
                          label="出生日期"
                        >
                          {getFieldDecorator('birthday', {
                            rules: [{
                              required: true, message: '请选择出生日期!',
                            }],
                            initialValue:moment(data.birthday)
                          })(
                            <DatePicker placeholder="选择出生日期"/>
                          )}
                       </FormItem>
                       <FormItem
                          {...formItemLayout}
                          label="籍贯"
                        >
                          {getFieldDecorator('nativePlace', {
                            rules: [{
                              required: true,whitespace:true, message: '请输入籍贯!',
                            }],
                            initialValue:data.nativePlace
                          })(
                            <Input placeholder="请输入籍贯" />
                          )}
                       </FormItem>
                   </div>
                   <div className="page_add_input_main_form" style={{width:'35%'}}>
                       <FormItem
                          {...formItemLayout}
                          label="入职日期"
                        >
                          {getFieldDecorator('hiredate', {
                            rules: [{
                              required: true, message: '请选择入职日期!',
                            }]
                            
                          })(
                            <DatePicker placeholder="选择入职日期" />
                          )}
                       </FormItem>
                       <FormItem
                          {...formItemLayout}
                          label="手机号码"
                        >
                          {getFieldDecorator('phoneNumber', {
                            rules: [{
                              required: true,whitespace:true, message: '请输入手机号码!',
                              
                            }],
                            initialValue:data.phoneNumber
                          })(
                            <Input placeholder="请输入手机号码" />
                          )}
                       </FormItem>
                       <FormItem
                          {...formItemLayout}
                          label="入职部门"
                        >
                        {getFieldDecorator('departmentId', {
                          rules: [
                            { required: true, message: '请选择入职部门!' },
                          ],
                          initialValue:data.departmentId
                          
                        })(
                          <Select placeholder="请选择入职部门">
                            {this.state.departmentTypeList.map((data,i)=>{
                              return <Option key={i} value={data.id}>{data.name}</Option>
                            })}
                          </Select>
                        )}
                       </FormItem>
                       <FormItem
                          {...formItemLayout}
                          label="入职岗位"
                        >
                        {getFieldDecorator('positionId', {
                          rules: [
                            { required: true, message: '请选择入职岗位!' },
                          ],
                          initialValue:data.positionId
                        })(
                          <Select placeholder="请选择入职岗位">
                            {this.state.positionTypeList.map((data,i)=>{
                              return <Option key={i} value={data.id}>{data.postName}</Option>
                            })}
                          </Select>
                        )}
                       </FormItem>
                       <FormItem
                          {...formItemLayout}
                          label="学校/专业"
                        >
                          {getFieldDecorator('school', {
                            rules: [{
                              required: true,whitespace:true, validator: this.check,
                            }],
                            initialValue: { school: data.school, subject: data.professional },
                          })(
                            <PriceInput />
                          )}
                       </FormItem>
                       <FormItem
                          {...formItemLayout}
                          label="最高学历"
                        >
                          {getFieldDecorator('educationTypeList', {
                            rules: [
                              { required: true, message: '请选择最高学历!' },
                            ],
                            initialValue:data.educationId
                            
                          })(
                            <Select placeholder="请选择最高学历">
                              {this.state.educationTypeList.map((data,i)=>{
                                return <Option key={i} value={data.id}>{data.name}</Option>
                              })}
                            </Select>
                          )}
                       </FormItem>
                   </div>
                   <div className="page_add_input_main_form" style={{width:'37%'}}>

                       <FormItem
                          {...formItemLayout}
                          label="邮箱地址"
                        >
                          {getFieldDecorator('email', {
                            rules: [{
                              required: false, message: '请输入邮箱地址!',
                            }],
                            initialValue:data.email
                          })(
                            <Input placeholder="请输入邮箱地址" />
                          )}
                       </FormItem>
                       <FormItem
                          {...formItemLayout}
                          label="微信号"
                        >
                          {getFieldDecorator('wechat', {
                            rules: [{
                              required: false, message: '请输入微信号!',
                            }],
                            initialValue:data.wechat
                            
                          })(
                            <Input placeholder="请输入微信号" />
                          )}
                       </FormItem>

                       <FormItem
                          {...formItemLayout}
                          label="员工类型/编号"
                        >
                        {getFieldDecorator('employeeId', {
                          rules: [{ required: true,whitespace:true, message: '请输入员工编号!' }],
                        })(
                          <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                        )}
                       </FormItem>

                       <FormItem
                          {...formItemLayout}
                          label="证件类型/号码"
                        >
                          {getFieldDecorator('papersId', {
                            rules: [{ required: true,whitespace:true, message: '请输入员工证件号码!' }],
                            initialValue:data.papersNumber
                          })(
                            <Input addonBefore={prefixSelectors} style={{ width: '100%' }} />
                          )}
                       </FormItem>
                       <FormItem
                          {...formItemLayout}
                          label="家庭住址"
                        >
                          {getFieldDecorator('address', {
                            rules: [{
                              required: true,whitespace:true, message: '请输入家庭住址!',
                            }],
                            initialValue:data.address
                            
                          })(
                            <Input placeholder="请输入家庭住址" />
                          )}
                       </FormItem>
                       <FormItem
                          {...formItemLayout}
                          label="国籍/民族"
                        >
                          {getFieldDecorator('guoji', {
                            rules: [{
                              required: true,validator: this.checkSlect
                            }],
                            initialValue: { gj: '请选择国籍', mz: '请选择民族' },
                          })(
                            <Selects nationTypeList={this.state.nationTypeList} ethnicTypeList={this.state.ethnicTypeList} />
                          )}
                       </FormItem>
                   </div>
               </div>
            </Form>
         </div>
         <div className="page_add_tabs">
           <Button type="primary" shape="circle" icon="plus" onClick={this.addBtn.bind(this)} style={{position:'absolute',right: 20,top: 25,cursor:'pointer',zIndex: 99}}/>
           <Tabs defaultActiveKey="1" tabBarStyle={{border:'none'}} onChange={this.tabCallback.bind(this)}>
             <TabPane tab="学习经历" key="1">
                <Table columns={columns1} dataSource={this.state.data1} bordered pagination={false}/>
             </TabPane>
             <TabPane tab="工作经历" key="2">
                <Table columns={columns2} dataSource={this.state.data2} bordered pagination={false}/>
             </TabPane>
             <TabPane tab="劳务合同" key="5">
                <Table columns={columns5} dataSource={this.state.data5} bordered pagination={false}/>
             </TabPane>
             <TabPane tab="社会关系" key="6">
                <Table columns={columns6} dataSource={this.state.data6} bordered pagination={false}/>
             </TabPane>
           </Tabs>
         </div>
         <Modal
            title={this.state.modalTitle}
            bodyStyle={{padding:0}}
            width={600}
            visible={this.state.visible1}
            onOk={this.handleSubmits}
            onCancel={this.handleCancel}
            okText="确定"
            cancelText="取消"
          >
           {this.state.key == 1 ? <Form1 educationTypeList={this.state.educationTypeList} ref="form1" /> : null}
           {this.state.key == 2 ? <Form2 educationTypeList={this.state.educationTypeList} ref="form2" /> : null}
           {this.state.key == 5 ? <Form5 educationTypeList={this.state.educationTypeList} ref="form5" /> : null}
           {this.state.key == 6 ? <Form6 educationTypeList={this.state.educationTypeList} ref="form6" /> : null}
        </Modal>
       </Spin>
      </div>
    );
  }
}

export default Form.create()(connect()(AddStaff1));
