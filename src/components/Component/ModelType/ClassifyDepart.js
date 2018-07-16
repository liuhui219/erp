import React from 'react';
import { Button, Modal, Form, Input, Radio, TreeSelect,Select } from 'antd';
import { Link } from 'react-router-dom';
import 'src/style/pages.less';
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const ModelDepart = Form.create()(
    class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                level:''
            };
        }
        onChange = (value,node) => {
            console.log(value)
            this.setState({ value });
        }
        render() {
            const { visible, onCreate, form, onCancel, title, ModalData, DataType } = this.props;
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
                    visible={visible}
                    DataType={DataType}
                    title={title}
                    okText="确定"
                    cancelText="取消"
                    onOk={ onCreate}
                    onCancel={onCancel}
                >
                    <Form layout="vertical" className="w_model_form clearfix">
                        <FormItem key='b' label='上级分类'>
                            {getFieldDecorator('parentId', {
                                rules: [{ required: true, message: '请选择上级分类'}],
                                initialValue:ModalData.value
                            })(
                                <TreeSelect
                                    style={{ width: 300 }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    treeData={ModalData.data}
                                    treeDefaultExpandAll
                                    placeholder='请选择上级分类'
                                    // treeDataSimpleMode={[{type:'ada'}]}
                                    onChange={this.onChange}
                                    onSelect={this.onSelect}
                                />
                            )}
                        </FormItem>
                        <FormItem  key={'name'} label='分类名称'>
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: '请输入分类名称'}],
                                    initialValue: ModalData.name
                                })(
                                    <Input placeholder="请输入分类名称"  className="w300"  />
                                )}
                        </FormItem>
                        <FormItem  key={'code'} label='分类编码'>
                                {getFieldDecorator('code', {
                                    rules: [{ required: true, message: '请输入分类编码'}],
                                    initialValue: ModalData.code
                                })(
                                    <Input placeholder="请输入分类编码"  className="w300"  />
                                )}
                        </FormItem>
                        
                 
                        {id}
                    </Form>
                </Modal>
            );
        }
    }
);
export default ModelDepart;

