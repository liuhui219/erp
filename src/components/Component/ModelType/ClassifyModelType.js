import React from 'react';
import { Button, Modal, Form, InputNumber,Cascader ,Input, Radio,Select,Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import 'src/style/pages.less';
import { options } from 'sw-toolbox';
import Position from '../CompanyAddr/Position';

const InputGroup = Input.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const CollectionCreateForm = Form.create()(
    class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
            };
        }
        render() {
            const { visible, onCreate, form,onCancel, title ,ModalData,DataType} = this.props;
            const { getFieldDecorator } = form;
            // const prefixSelectors = getFieldDecorator('prefixs', {
            //     initialValue: data.papersId,
            //   })(
            //     <Select style={{ width: 95 }}>
            //       {/* {this.state.papersTypeList.map((data,i)=>{
            //         return <Option key={i} value={data.id}>{data.name}</Option>
            //       })} */}
            //     </Select>
            //   );
            let id = null;  
            if( DataType.type == 'edit'){
                id = <FormItem className="none" key={'id'} label='id'>
                        {getFieldDecorator('id', {
                        initialValue:DataType.id 
                        })(
                        <Input  />
                        )}
                        </FormItem>
                }
            return (
                <Modal
                    visible={visible}
                    DataType={DataType}
                    title={title}
                    okText="确定"
                    cancelText="取消"
                    onOk={onCreate}
                    onCancel={onCancel}
                >
                    <Form  layout="vertical" className="w_model_form clearfix">
                        {ModalData.map((item,index) =>{
                            return(
                               <div  key={index}>
                                   { item.tag == 'input' &&
                                        <FormItem  className={item.showHide === 0?'none':'block '} label={item.name}>
                                            {getFieldDecorator(item.key, {
                                            rules: [{ required: item.must, message: item.massage }],
                                            initialValue:item.value
                                            })(
                                            <Input style={{ width: 300 }} />
                                            )}
                                        </FormItem>
                                    } 
                                    { item.tag == 'InputNumber' &&
                                        <FormItem  className={item.showHide === 0?'none':'block '} label={item.name}>
                                            {getFieldDecorator(item.key, {
                                            rules: [{ required: item.must, message: item.massage }],
                                            initialValue:item.value
                                            })(
                                            <InputNumber style={{ width: 300 }} />
                                            )}
                                        </FormItem>
                                    } 
                                    { item.tag == 'select' &&
                                        <FormItem    label={item.name}  >
                                            {getFieldDecorator(item.key, {
                                            rules: [{ required: item.must, message: item.massage }],
                                            initialValue:item.value
                                            })(
                                                <Select style={{ width: 300 }}>
                                                    {item.data.map((a,index)=><Option key={index} value={a.id}  >{a.categoryName}</Option>)}
                                                </Select>
                                            )}
                                        </FormItem>
                                    }
                                    { item.tag == 'checkbox' &&
                                        <FormItem   label={item.name}>
                                            {getFieldDecorator(item.key, {
                                            rules: [{ required: item.must, message: item.massage }],
                                            initialValue:item.value
                                            
                                            })(
                                                <CheckboxGroup  options={item.options} />
                                            )}
                                        </FormItem>
                                    }
                                    { item.tag == 'selectAddr' &&
                                        <FormItem   label={item.name}>
                                            {getFieldDecorator(item.key, {
                                            rules: [{ required: item.must, message: item.massage }],
                                            initialValue:item.value
                                            
                                            })(
                                                 <Cascader style={{ width: 300 }}  options={Position} placeholder="请选择省市区" />
                                       
                                            )}
                                        </FormItem>
                                         


                                    }
                                    { item.tag == 'InputGroup' &&
                                        <FormItem   label={item.name}>
                                           {/* {getFieldDecorator(item.key, {
                                            rules: [{ required: item.must, message: item.massage }],
                                            // initialValue:'2131'
                                            
                                            })(
                                                <Input addonBefore={prefixSelectors}></Input> */}
                                                <InputGroup compact >
                                                    <FormItem  style={{ marginBottom:0 }} >
                                                        {getFieldDecorator(item.data.key, {
                                                        rules: [{ required: item.data.must, message: item.data.massage }],
                                                        initialValue:item.data.value
                                                        })(
                                                            <Select  style={{ width: 50,marginBottom:0 }}>
                                                                {item.data.child.map((a,index)=><Option key={index} value={a.id}  >{a.text}</Option>)}
                                                              
                                                            </Select>
                                                        )}
                                                    </FormItem>
                                                    <FormItem   style={{ marginBottom:0 }}>
                                                        {getFieldDecorator(item.inputCenter.key, {
                                                        rules: [{ required: item.inputCenter.must, message: item.inputCenter.massage }],
                                                        initialValue:item.inputCenter.value
                                                        
                                                        })(
                                                            <InputNumber style={{ width: 250 }}/>
                                                        )}
                                                    </FormItem>
                                                   
                                                </InputGroup>
                                                
                                        {/* //     )} */}
                                        </FormItem>
                                    }
                                    

                                    

                               </div>
                               
                            )
                        })}
                        {id}
                    </Form>
                </Modal>
            );
        }
    }
);
export default CollectionCreateForm;

