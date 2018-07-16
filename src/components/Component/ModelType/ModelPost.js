import React from 'react';
import { Button, Modal, Form, Input,InputNumber,Checkbox, Radio, TreeSelect,Select } from 'antd';
import { Link } from 'react-router-dom';
import 'src/style/pages.less';
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const ModelPost = Form.create()(
    class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
            };
        }
        onChange = (value,node) => {
            this.setState({ value });
        }


        // onSelect = (value,node,extra) => {
        //     this.props.ModalData.level=node.props.level
        // }
        render() {  
            const { visiblePost, onCreate, form, onCancel, title, ModalData, DataType } = this.props;
            const { getFieldDecorator } = form;
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
                    visible={visiblePost}
                    DataType={DataType}
                    title={title}
                    okText="确定"
                    cancelText="取消"
                    onOk={onCreate}
                    onCancel={onCancel}
                >
                    <Form layout="vertical" className="w_model_form clearfix">
                        <FormItem key='b' label='部门'>
                            {getFieldDecorator('departmentId', {
                                rules: [{ required: true, message: '请选择部门'}],
                                initialValue:ModalData.value
                            })(
                                <TreeSelect
                                    style={{ width: 300 }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    treeData={ModalData.data}
                                    placeholder="请选择部门"
                                    treeDefaultExpandAll
                                    onChange={this.onChange}
                                    onSelect={this.onSelect}
                                />
                            )}
                        </FormItem>
                        <FormItem  key={'postName'} label='岗位名称'>
                                {getFieldDecorator('postName', {
                                    rules: [{ required: true, message: '请输入岗位名称'}],
                                    initialValue: ModalData.postName
                                })(
                                    <Input placeholder="请输入岗位名称"  className="w300"  />
                                )}
                        </FormItem>
                        <FormItem  key={'amount'} label='人员编制'>
                                {getFieldDecorator('amount', {
                                    rules: [{ required: true, message: '请输入人员编制'}],
                                    initialValue: ModalData.amount
                                })(
                                    <InputNumber min={1} placeholder="请输入人员编制"  className="w300"  />
                                )}
                        </FormItem>
                        <FormItem  key={'isManager'} label='部门管理岗' >
                            {getFieldDecorator('isManager', {
                                valuePropName: 'checked',
                                initialValue: ModalData.isManager == 1?true:false,
                            })(
                                <Checkbox></Checkbox>
                            )}
                        </FormItem>
                        {id}
                    </Form>
                </Modal>
            );
        }
    }
);
export default ModelPost;

