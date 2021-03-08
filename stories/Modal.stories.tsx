import { Meta } from '@storybook/react';
import { Alert, Button, Collapse, List } from '@tencent/tea-component';
import '@tencent/tea-component/lib/tea.css';
import React, { useRef } from 'react';
import { Modal, ModalComponentProps } from '../dist';

const show = () => {
  const modalRef = useRef<Modal>(null);
  const innerRef = useRef<ModalComponentProps>(null);
  const alertCustom = async () => {
    const flag = await modalRef.current?.show(
      {
        ref: innerRef,
        title: '标题',
        flags: Modal.OK | Modal.CANCEL | Modal.YES | Modal.NO | Modal.CLOSE, // 需要显示的按钮们
        yesLabel: '拒绝',
        onClose: async (flag) => {
          // 判断用户点击了哪个按钮
          if (flag & Modal.OK) {
            console.log('你点击了‘确定’');
          }
          if (flag & Modal.YES) {
            console.log('你点击了‘拒绝’');
            return Modal.REJECT; // 阻止窗口关闭
          }
        },
      },
      <>
        <Alert carouselMode defaultVisible>
          <>小程序云服务器有奖内测中，即刻成为产品体验官</>
          <>云服务器限时秒杀，首购1C1G仅需99元/年</>
          <>让企业普惠上云，云服务器最低至2.5折</>
        </Alert>
        <Alert>
          <h4 style={{ marginBottom: 8 }}>重要声明</h4>
          <p>本功能将在 2019 年 2 月 29 日下线，请注意做好下列迁移工作：</p>
          <List type="bullet">
            <List.Item>小程序云服务器有奖内测中，即刻成为产品体验官</List.Item>
            <List.Item>
              云服务器限时秒杀，首购1C1G仅需99元/年，还有多款配置供您选择
            </List.Item>
          </List>
        </Alert>
        <Alert type="warning">
          <h4 style={{ marginBottom: 8 }}>重要声明</h4>
          <p>本功能将在 2019 年 2 月 29 日下线，请注意做好下列迁移工作：</p>
          <List type="bullet">
            <List.Item>小程序云服务器有奖内测中，即刻成为产品体验官</List.Item>
            <List.Item>
              云服务器限时秒杀，首购1C1G仅需99元/年，还有多款配置供您选择
            </List.Item>
            <List.Item>
              让企业普惠上云，云服务器最低至2.5折，还有更多产品更低折扣满足您的需求
            </List.Item>
          </List>
          <Collapse iconPosition="right" style={{ marginTop: 8 }}>
            <Collapse.Panel
              id="1"
              title={(active) => (active ? '收起' : '展开')}
              position="top"
            >
              <List type="bullet" style={{ marginTop: 8 }}>
                <List.Item>更多提示语</List.Item>
                <List.Item>More</List.Item>
              </List>
            </Collapse.Panel>
          </Collapse>
        </Alert>
      </>
    );
    console.log(`最终窗口点击了哪个按钮（可能是被 onClose 更改的）${flag}`);
  };
  return (
    <>
      <Button onClick={alertCustom}>自定义提示</Button>
      <Modal ref={modalRef} />
    </>
  );
};
const success = () => {
  const modalRef = useRef<Modal>(null);
  const alertSuccess = async () =>
    await modalRef.current?.success({
      message: '路由表更新成功！',
      description: '配置将在 1-3 分钟内同步到集群中的路由节点',
    });
  return (
    <>
      <Button onClick={alertSuccess}>提示成功</Button>
      <Modal ref={modalRef} />
    </>
  );
};
const confirm = () => {
  const modalRef = useRef<Modal>(null);
  const askQuestion = async () => {
    const flag = await modalRef.current?.confirm({
      message: '确认删除当前所选实例？',
      description: '删除后，该实例下的所有配置将会被清空，且无法恢复。',
      okLabel: '删除',
      cancelLabel: '取消',
    });
    if (flag! & Modal.OK) {
      await modalRef.current?.success({
        message: '删除成功',
      });
    } else if (flag! & Modal.CANCEL) {
      await modalRef.current?.error({
        message: '删除失败',
      });
    }
  };
  return (
    <>
      <Button onClick={askQuestion}>删除前询问</Button>
      <Modal ref={modalRef} />
    </>
  );
};
const warn = () => {
  const modalRef = useRef<Modal>(null);
  const alertWarn = async () =>
    await modalRef.current?.warn({
      message: '路由表更新失败！',
      description: '路由表包含无效的路由转发策略公网网关的网络',
    });
  return (
    <>
      <Button onClick={alertWarn}>提示警告</Button>
      <Modal ref={modalRef} />
    </>
  );
};
const error = () => {
  const modalRef = useRef<Modal>(null);
  const alertError = async () =>
    await modalRef.current?.error({
      message: '路由表更新失败！',
      description: '路由表包含无效的路由转发策略公网网关的网络',
    });
  return (
    <>
      <Button onClick={alertError}>提示失败</Button>
      <Modal ref={modalRef} />
    </>
  );
};

export const Show = show.bind({});
export const Confirm = confirm.bind({});
export const Success = success.bind({});
export const Warn = warn.bind({});
export const Error = error.bind({});

const meta: Meta = {
  title: 'Modal',
};

export default meta;
