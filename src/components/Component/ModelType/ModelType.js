import React from 'react';
import { Button, Modal, Form, Input, Radio } from 'antd';
import { Link } from 'react-router-dom';
import 'src/style/pages.less';
const FormItem = Form.Item;
const CollectionCreateForm = Form.create()(
    class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
            };
        }
        data = () => {
            console.log(this.props)
            // this.state.ModalData.map((item) => {
            //     <h1>1231</h1>
            // })

        }
        render() {
            const { visible, onCreate, form,onCancel, title ,ModalData,DataType} = this.props;
            const { getFieldDecorator } = form;
            console.log(ModalData)
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
                    <Form layout="vertical">
                        {ModalData.map((item,index) =>{
                            return(
                                <FormItem  key={index} label={item.name}>
                                    {getFieldDecorator(item.key, {
                                    rules: [{ required: item.must, message: item.massage }],
                                    initialValue:item.value
                                    })(
                                    <Input  />
                                    )}
                                </FormItem>
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

