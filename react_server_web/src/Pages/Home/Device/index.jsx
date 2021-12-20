import React, { Component, Fragment } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Message,
  Modal,
  Notification,
  Popconfirm,
  Table,
  Tag,
} from "@arco-design/web-react";
import Http from "../../../Services";
import "./index.css";

class Device extends Component {
  state = {
    columns: [
      {
        title: "Device ID",
        dataIndex: "id",
        align: "center",
      },
      {
        title: "Name",
        dataIndex: "name",
        align: "center",
      },
      {
        title: "Status",
        dataIndex: "status",
        align: "center",
        render: (col, item) => {
          let tag;

          if (item.status === "online") {
            tag = <Tag color="green">{item.status}</Tag>;
          } else {
            tag = <Tag color="gray">{item.status}</Tag>;
          }

          return <Fragment>{tag}</Fragment>;
        },
      },
      {
        title: "Registration Time",
        dataIndex: "register_time",
        align: "center",
      },
      {
        title: "Operation",
        dataIndex: "op",
        align: "center",
        render: (col, item) => {
          const { changeLoading, deleteLoading } = this.state;
          let changeButton;
          let deleteButton;

          if (item.status === "online") {
            changeButton = (
              <Button
                className="op-button"
                loading={changeLoading}
                onClick={this.changeDeviceState(item.id, item.status)}
                status="warning"
              >
                Pause
              </Button>
            );
            deleteButton = (
              <Button status="danger" disabled>
                Delete
              </Button>
            );
          } else {
            changeButton = (
              <Button
                className="op-button"
                loading={changeLoading}
                onClick={this.changeDeviceState(item.id, item.status)}
                status="success"
              >
                Start
              </Button>
            );
            deleteButton = (
              <Popconfirm
                title="Are you sure you want to delete?"
                onOk={this.deleteDevice(item.id)}
                okButtonProps={{ loading: deleteLoading }}
              >
                <Button status="danger">Delete</Button>
              </Popconfirm>
            );
          }

          return (
            <div>
              {changeButton}
              <Button
                className="op-button"
                onClick={this.setUpdateModalState(item)}
              >
                Edit
              </Button>
              {deleteButton}
            </div>
          );
        },
      },
    ],
    deviceList: [],
    selectedRowKeys: [],
    isAddModalVisible: false,
    isUpdateModalVisible: false,
    editDeviceId: "",
    deviceName: "",
    deviceRegisterTime: "",
    deleteAllLoading: false,
    updateAllLoading: false,
    changeLoading: false,
    updateLoading: false,
    deleteLoading: false,
    addLoading: false,
  };

  async componentDidMount() {
    await this.updateDeviceList();
  }

  setSelectedRowKeys = (selectedRowKeys) => {
    console.log(selectedRowKeys);
    this.setState({
      selectedRowKeys,
    });
  };

  deleteSelectedDevices = async () => {
    const serverInfo = JSON.parse(localStorage.getItem("serverInfo"));
    let { deviceList, selectedRowKeys } = this.state;

    if (!selectedRowKeys.length) {
      Notification.info({
        title: "Notice",
        content: "You did not select any rows !",
      });
      return;
    }

    let params = {
      server_id: serverInfo.id,
      server_name: serverInfo.name,
      devices: JSON.stringify(selectedRowKeys),
    };

    this.setState({ deleteAllLoading: true });
    const res = await Http.postRequest("/delete_selected_devices", params);
    this.setState({ deleteAllLoading: false });

    if (res.code === 200 && res.data) {
      deviceList = deviceList.filter(
        (item) => !selectedRowKeys.includes(item.id)
      );

      this.setState({
        deviceList,
        selectedRowKeys: [],
      });

      Notification.success({
        title: "Success",
        content: "These devices have been deleted !",
      });
    } else {
      Notification.error({
        title: "Error",
        content: "Failed to delete these devices !",
      });
    }
  };

  setAddModalState = () => {
    this.setState({
      deviceName: "",
      deviceRegisterTime: "",
      isAddModalVisible: !this.state.isAddModalVisible,
    });
  };

  addDevice = async () => {
    let { isAddModalVisible, deviceName, deviceRegisterTime } = this.state;
    let serverInfo = JSON.parse(localStorage.getItem("serverInfo"));

    if (deviceName === "" || deviceRegisterTime === "") {
      Message.error("Some of the information cannot be empty !");
      return;
    }

    const params = {
      server_id: serverInfo.id,
      server_name: serverInfo.name,
      name: deviceName,
      register_time: deviceRegisterTime,
    };

    this.setState({ addLoading: true });
    const res = await Http.postRequest("/add_device", params);

    if (res.code === 200 && res.data) {
      await this.updateDeviceList();

      this.setState({
        addLoading: false,
        isAddModalVisible: !isAddModalVisible,
      });
    } else {
      Notification.error({ title: "Error", content: "Failed to add device !" });
    }
  };

  updateDeviceList = async () => {
    if (!localStorage.getItem("serverInfo")) return;

    const serverInfo = JSON.parse(localStorage.getItem("serverInfo"));

    this.setState({ updateAllLoading: true });
    const res = await Http.postRequest("/get_device_list", {
      id: serverInfo.id,
    });
    this.setState({ updateAllLoading: false });

    if (res.code === 200) {
      const deviceList = res.data.map((item) => {
        if (item.status === 0) return { ...item, status: "offline" };
        else return { ...item, status: "online" };
      });

      console.log(deviceList);

      this.setState({
        deviceList,
      });

      Notification.success({
        title: "Success",
        content: "Device list updated successfully !",
      });
    } else {
      Notification.error({
        title: "Error",
        content: "Device list update failed !",
      });
    }
  };

  changeDeviceState = (id, status) => {
    return async () => {
      const serverInfo = JSON.parse(localStorage.getItem("serverInfo"));
      let { deviceList } = this.state;
      let params = {
        server_id: serverInfo.id,
        server_name: serverInfo.name,
        id,
        status,
      };

      this.setState({ changeLoading: true });
      const res = await Http.postRequest("./change_device_status", params);
      this.setState({ changeLoading: false });

      console.log(res);

      if (res.code === 200 && res.data) {
        deviceList = deviceList.map((item) => {
          if (item.id !== id) return item;

          if (item.status === "online") return { ...item, status: "offline" };
          else return { ...item, status: "online" };
        });

        this.setState({
          deviceList,
        });

        Notification.success({
          title: "Success",
          content: "Switch device status successfully !",
        });
      } else {
        Notification.error({
          title: "Error",
          content: "Failed to switch device status !",
        });
      }
    };
  };

  setUpdateModalState = (item) => {
    return () => {
      this.setState({
        editDeviceId: item ? item.id : "",
        deviceName: item ? item.name : "",
        deviceRegisterTime: item ? item.register_time : "",
        isUpdateModalVisible: !this.state.isUpdateModalVisible,
      });
    };
  };

  editDeviceName = (name) => {
    this.setState({
      deviceName: name,
    });
  };

  selectRegisterTime = (time) => {
    this.setState({
      deviceRegisterTime: time,
    });
  };

  clearRegisterTime = () => {
    this.setState({
      deviceRegisterTime: "",
    });
  };

  updateDevice = async () => {
    const serverInfo = JSON.parse(localStorage.getItem("serverInfo"));
    let {
      deviceList,
      isUpdateModalVisible,
      editDeviceId,
      deviceName,
      deviceRegisterTime,
    } = this.state;

    if (deviceName === "" || deviceRegisterTime === "") {
      Message.error("Some of the information cannot be empty !");
      return;
    }

    const params = {
      server_id: serverInfo.id,
      server_name: serverInfo.name,
      id: editDeviceId,
      name: deviceName,
      register_time: deviceRegisterTime,
    };

    this.setState({ updateLoading: true });
    const res = await Http.postRequest("/update_device", params);
    this.setState({ updateLoading: false });

    if (res.code === 200 && res.data) {
      deviceList = deviceList.map((item) => {
        if (item.id !== editDeviceId) return item;

        return { ...item, name: deviceName, register_time: deviceRegisterTime };
      });

      this.setState({
        deviceList,
        isUpdateModalVisible: !isUpdateModalVisible,
      });

      Notification.success({
        title: "Success",
        content: "Device information updated successfully !",
      });
    } else {
      Notification.error({
        title: "Error",
        content: "Device information update failed !",
      });
    }
  };

  deleteDevice = (id) => {
    return async () => {
      const serverInfo = JSON.parse(localStorage.getItem("serverInfo"));
      let { deviceList } = this.state;
      let params = {
        server_id: serverInfo.id,
        server_name: serverInfo.name,
        id,
      };

      this.setState({ deleteLoading: true });
      const res = await Http.postRequest("/delete_device", params);
      this.setState({ deleteLoading: false });

      if (res.code === 200 && res.data) {
        deviceList = deviceList.filter((item) => item.id !== id);

        this.setState({
          deviceList,
        });

        Notification.success({
          title: "Success",
          content: "The device has been deleted !",
        });
      } else {
        Notification.error({
          title: "Error",
          content: "Failed to delete the device !",
        });
      }
    };
  };

  render() {
    const {
      columns,
      deviceList,
      selectedRowKeys,
      isAddModalVisible,
      isUpdateModalVisible,
      editDeviceId,
      deviceName,
      deviceRegisterTime,
      deleteAllLoading,
      updateAllLoading,
      updateLoading,
      addLoading,
    } = this.state;
    const InputSearch = Input.Search;
    const FormItem = Form.Item;

    return (
      <Fragment>
        <div className="operation">
          <span className="op-left">
            <Popconfirm
              title="Are you sure you want to delete?"
              onOk={this.deleteSelectedDevices}
              okButtonProps={{ loading: deleteAllLoading }}
            >
              <Button type="outline">Delete Selected</Button>
            </Popconfirm>

            <InputSearch
              className="op-space"
              allowClear
              placeholder="Enter keyword to search ..."
              style={{ width: 350 }}
            />

            <Button
              className="op-space"
              onClick={this.setAddModalState}
              type="outline"
              status="success"
            >
              Add Device
            </Button>
          </span>
          <span className="op-right">
            <Button
              onClick={this.updateDeviceList}
              type="outline"
              loading={updateAllLoading}
            >
              Update
            </Button>
          </span>
        </div>
        
        <Table
          rowKey="id"
          columns={columns}
          data={deviceList}
          borderCell={true}
          pagination={{
            total: deviceList.length,
            pageSize: 8,
            showTotal: true,
            showJumper: true,
          }}
          rowSelection={{
            checkAll: "false",
            type: "checkbox",
            selectedRowKeys,
            onChange: (selectedRowKeys) => {
              console.log("onChange:", selectedRowKeys);
              this.setSelectedRowKeys(selectedRowKeys);
            },
          }}
        />

        <Modal
          title="Edit Device Information"
          visible={isAddModalVisible}
          onCancel={this.setAddModalState}
          autoFocus={false}
          focusLock={true}
          footer={null}
          simple
        >
          <Form layout="vertical">
            <FormItem
              label="Device Name"
              field="name"
              rules={[{ required: true, message: "Device name is required" }]}
              initialValue={deviceName}
            >
              <Input
                onChange={this.editDeviceName}
                placeholder="Please enter device name ..."
              />
            </FormItem>
            <FormItem
              label="Register Time"
              field="register_time"
              rules={[{ required: true, message: "Register time is required" }]}
              initialValue={deviceRegisterTime}
            >
              <DatePicker
                className="date-picker"
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                onClear={this.clearRegisterTime}
                onOk={this.selectRegisterTime}
              />
            </FormItem>
            <FormItem className="form-buttons">
              <Button onClick={this.setAddModalState}>Cancel</Button>
              <Button
                className="op-space"
                loading={addLoading}
                onClick={this.addDevice}
                type="primary"
              >
                Confirm
              </Button>
            </FormItem>
          </Form>
        </Modal>

        <Modal
          title="Edit Device Information"
          visible={isUpdateModalVisible}
          onCancel={this.setUpdateModalState()}
          autoFocus={false}
          focusLock={true}
          footer={null}
          simple
          unmountOnExit
        >
          <Form layout="vertical">
            <FormItem
              label="Device ID"
              field="id"
              rules={[{ required: true, message: "Device name is required" }]}
              simple={true}
              initialValue={editDeviceId}
            >
              <Input disabled />
            </FormItem>
            <FormItem
              label="Device Name"
              field="name"
              rules={[{ required: true, message: "Device name is required" }]}
              initialValue={deviceName}
            >
              <Input
                onChange={this.editDeviceName}
                placeholder="Please enter device name ..."
              />
            </FormItem>
            <FormItem
              label="Register Time"
              field="register_time"
              rules={[{ required: true, message: "Register time is required" }]}
              initialValue={deviceRegisterTime}
            >
              <DatePicker
                className="date-picker"
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                onClear={this.clearRegisterTime}
                onOk={this.selectRegisterTime}
              />
            </FormItem>
            <FormItem className="form-buttons">
              <Button onClick={this.setUpdateModalState()}>Cancel</Button>
              <Button
                className="op-space"
                loading={updateLoading}
                onClick={this.updateDevice}
                type="primary"
              >
                Confirm
              </Button>
            </FormItem>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default Device;
