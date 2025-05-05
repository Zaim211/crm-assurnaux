import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Upload,
  Avatar,
  Breadcrumb,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,

} from "@ant-design/icons";
import ListAdmin from "./Admin/ListAdmin";
// import ListManager from "./Manager/ListManager";


const getInitials = (prenom, nom) => {
  if (!prenom || !nom) return "";
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
};

const CommerciauxPage = () => {
  const [commercials, setCommercials] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCommercial, setCurrentCommercial] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCommercials();
  }, []);

  const fetchCommercials = async () => {
    try {
      const response = await axios.get("/commercials");
      setCommercials(response.data);
    } catch (error) {
      console.error("Error fetching commercials:", error);
    }
  };

  const handleAddCommercial = () => {
    setIsEditing(false);
    setCurrentCommercial(null);
    setIsModalVisible(true);
  };

  const handleEditCommercial = (commercial) => {
    setIsEditing(true);
    setCurrentCommercial(commercial);
    form.setFieldsValue({
      ...commercial,
      password: "", // Clear the password field when editing
    });
    setIsModalVisible(true);
  };

  const handleDeleteCommercial = async (commercialId) => {
    try {
      await axios.delete(`/commercials/${commercialId}`);
      message.success("Commercial supprimé avec succès");
      fetchCommercials();
    } catch (error) {
      console.error("Error deleting commercial:", error);
      message.error("Erreur lors de la suppression du commercial");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setCurrentCommercial(null);
  };

  const handleSave = async (values) => {
    try {
      if (isEditing) {
        await axios.put(`/commercials/${currentCommercial._id}`, values);
        message.success("Commercial mis à jour avec succès");
      } else {
        await axios.post("/commercials", values);
        message.success("Commercial ajouté avec succès");
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchCommercials();
    } catch (error) {
      console.error("Error saving commercial:", error);
      message.error("Erreur lors de la sauvegarde du commercial");
    }
  };

  const columns = [
    {
      title: "Nom Prénom",
      key: "nomPrenom",
      render: (text, record) => (
        <div className="flex items-center">
          {record.image ? (
            <img
              src={record.image}
              alt="Commercial"
              className="w-9 h-9 rounded-full mr-2"
            />
          ) : (
            <Avatar
              style={{ backgroundColor: "" }}
              size={40}
              className="mr-2 bg-purple-800 text-white"
            >
              {getInitials(record.prenom, record.nom)}
            </Avatar>
          )}
          <span>
            {" "}
            {record.prenom} {record.nom}
          </span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Téléphone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Button
            type="primary"
            icon={<EditOutlined style={{ color: "white" }} />}
            className="mr-2"
            
            style={{ backgroundColor: "green", borderColor: "green" }}
            onClick={() => handleEditCommercial(record)}
            shape="circle"
          />
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce commercial?"
            onConfirm={() => handleDeleteCommercial(record._id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button
              type="danger"
              icon={<DeleteOutlined style={{ color: "white" }} />}
              style={{ backgroundColor: "red", borderColor: "red" }}
              shape="circle"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
   <>
     <div className="p-8 border rounded shadow-lg mt-4">
      <h2 className="text-2xl font-bold mb-4">Gestion des Commerciaux</h2>
      <Button
        type=""
        className="bg-purple-800 text-white"
        icon={<PlusOutlined />}
        onClick={handleAddCommercial}
      >
        Ajouter un Commercial
      </Button>
      <Table
        columns={columns}
        dataSource={commercials}
        rowKey="_id"
        className="mt-4"
        scroll={{ x: "max-content" }}
      />
      <Modal
        title={isEditing ? "Modifier le Commercial" : "Ajouter un Commercial"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="nom"
            label="Nom"
            rules={[{ required: true, message: "Veuillez entrer le nom" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="prenom"
            label="Prénom"
            rules={[{ required: true, message: "Veuillez entrer le prénom" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Veuillez entrer l'email" }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Téléphone"
            rules={[
              { required: true, message: "Veuillez entrer le téléphone" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mot de passe"
            rules={[
              {
                required: !isEditing,
                message: "Veuillez entrer le mot de passe",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="" className="bg-purple-800 text-white" htmlType="submit">
              Enregistrer
            </Button>
            <Button onClick={handleCancel} className="ml-2">
              Annuler
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
    <div className="p-4 border rounded shadow-lg mt-4">
      <ListAdmin />
    </div>
    {/* <div className="p-4 border rounded shadow-lg mt-4">
      <ListManager />
    </div> */}
   </>
  );
};

export default CommerciauxPage;
