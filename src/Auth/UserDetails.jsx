import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Auth from '../service/Auth';
import TransferService from '../service/Trunsuction';
import { motion } from 'framer-motion';
import { useAuth } from '../providers/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserTreeItem from './UsersTree';

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [role, setRole] = useState('');
  const [userTreeData, setUserTreeData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const { user: authUser } = useAuth();
  const authService = new Auth();
  const transferService = new TransferService();
  const [loading, setLoading] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const roles = ["SuperAdmin", "Admin", "Partner", "Assistant", "User"];

  const [menuOpenId, setMenuOpenId] = useState(null);

  const openUpdateModal = () => {
    if (selectedUser) {
      setNewUsername(selectedUser.username);
      setRole(selectedUser.role);
    }
    setShowUpdateModal(true);
  };
  const openTransferModal = () => setShowTransferModal(true);
  const openDeleteModal = () => setShowDeleteModal(true);

  const closeModals = () => {
    setShowUpdateModal(false);
    setShowTransferModal(false);
    setShowDeleteModal(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const result = await authService.getUserById(userId);
        if (result.success) {
          setUser(result.user);
          setSelectedUser(result.user);
          setNewUsername(result.user.username);
          setRole(result.user.role);
          const treeResult = await authService.getUsersByCreaterId(userId);
          if (treeResult.success) {
            setUserTreeData(treeResult.user);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleUpdate = async () => {
    const userUpdateData = {
      username: newUsername,
      role: role,
      password: newPassword,
    };

    const updateUser = await authService.updateUser(selectedUser._id, userUpdateData);
    if (updateUser.success) {
      toast.success("Utilisateur mis à jour avec succès!");
    } else {
      toast.error("Erreur lors de la mise à jour de l'utilisateur.");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");

    if (confirmed) {
      const deleteUserResponse = await authService.deleteUserById(selectedUser._id);
      if (deleteUserResponse.success) {
        toast.success("Utilisateur supprimé avec succès !");
        navigate('/users');
      } else {
        toast.error("Erreur lors de la suppression de l'utilisateur.");
      }
    }
  };

  const handleDeposit = async () => {
    try {
      const response = await transferService.makeTransfer(
        authUser.user._id,
        selectedUser._id,
        amount,
        "deposit",
        ""
      );
      if (response.success) {
        toast.success("Depot effectué avec succès !");
        setTimeout(() => window.location.reload(), 3000);
      } else {
        toast.error("Erreur lors de l'exécution du dépôt.");
      }
    } catch (error) {
      console.error("Erreur lors du dépôt:", error);
      toast.error("Une erreur est survenue lors du dépôt. Veuillez réessayer.");
    }
  };

  const handleWithdraw = async () => {
    try {
      const response = await transferService.makeTransfer(
        authUser.user._id,
        selectedUser._id,
        amount,
        "withdraw",
        ""
      );
      if (response.success) {
        toast.success("Retrait effectué avec succès !");
        setTimeout(() => window.location.reload(), 3000);
      } else {
        toast.error("Erreur lors de l'exécution du retrait.");
      }
    } catch (error) {
      console.error("Erreur lors du retrait:", error);
      toast.error("Une erreur est survenue lors du retrait. Veuillez réessayer.");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-50 p-4 h-full shadow-lg overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Arbre des utilisateurs</h3>
        {userTreeData ? (
          <UserTreeItem 
            user={userTreeData} 
            onUserSelect={(user) => setSelectedUser(user)} 
            menuOpenId={menuOpenId} 
            setMenuOpenId={setMenuOpenId} 
            openModals={{ openUpdateModal, openTransferModal, openDeleteModal }}
          />
        ) : (
          <p className="text-gray-500">Aucun utilisateur sous ce créateur.</p>
        )}
      </div>
      
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex justify-center items-center pt-8">
          <h4 className="text-2xl font-bold text-gray-800">Modifier Utilisateur</h4>
        </div>
        
        <div className="mb-4">
          <label className="font-bold">ID:</label>
          <span className="ml-2 text-gray-600">{user?._id}</span>
        </div>

        <div className="mb-4">
          <label className="font-bold">Nom d'utilisateur:</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="ml-2 border p-2 rounded-md w-full"
            placeholder="Nom d'utilisateur"
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="font-bold">Rôle:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="ml-2 border p-2 rounded-md w-full"
            disabled={loading}
          >
            {roles.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleOption}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="font-bold">Nouveau mot de passe:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="ml-2 border p-2 rounded-md w-full"
            placeholder="Nouveau mot de passe"
            disabled={loading}
          />
        </div>

        <div className="flex space-x-4 pt-1 pb-4">
          <button
            className="flex-1 bg-green-600 text-white p-2 rounded-lg hover:bg-green-500 transition"
            onClick={handleUpdate}
            disabled={loading}
          >
            Mettre à jour
          </button>
          <button
            className="flex-1 bg-red-600 text-white p-2 rounded-lg hover:bg-red-500 transition"
            onClick={handleDelete}
            disabled={loading}
          >
            Supprimer
          </button>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="flex justify-center items-center pt-8">
          <h4 className="text-2xl font-bold text-gray-800">Faire un transfert</h4>
        </div>

        <div className="mb-4">
          <div className="mb-4">
            <label className="font-bold">Solde:</label>
            <span className="ml-2 text-gray-600">{user?.balance || 0} TND</span>
          </div>
          <label className="font-bold">Montant:</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border p-2 rounded-md"
            placeholder="Montant"
            disabled={loading}
          />
        </div>

        <div className="flex mb-4 space-x-2">
          {[500, 1000, 5000, 25000].map((value) => (
            <button
              key={value}
              className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
              onClick={() => setAmount(value)}
              disabled={loading}
            >
              {value.toLocaleString()} TND
            </button>
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            className="flex-1 bg-green-600 text-white p-2 rounded-lg hover:bg-green-500 transition"
            onClick={handleDeposit}
            disabled={loading}
          >
            Dépôt
          </button>
          <button
            className="flex-1 bg-red-600 text-white p-2 rounded-lg hover:bg-red-500 transition"
            onClick={handleWithdraw}
            disabled={loading}
          >
            Retrait
          </button>
        </div>

        {transactionMessage && (
          <div className="mt-4 p-2 text-center bg-gray-200 rounded">
            {transactionMessage}
          </div>
        )}
      </div>

      <ToastContainer />

      {/* Modals for Update, Transfer, and Delete Actions */}
      {showUpdateModal && selectedUser && (
        <motion.div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={closeModals}>
          <div className="bg-white p-6 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Modifier l'utilisateur</h2>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full border p-2 rounded-md mb-4"
              placeholder="Nom d'utilisateur"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border p-2 rounded-md mb-4"
            >
              {roles.map((roleOption) => (
                <option key={roleOption} value={roleOption}>
                  {roleOption}
                </option>
              ))}
            </select>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border p-2 rounded-md mb-4"
              placeholder="Nouveau mot de passe"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpdate}>
              Mettre à jour
            </button>
            <button className="ml-4 px-4 py-2 rounded" onClick={closeModals}>
              Annuler
            </button>
          </div>
        </motion.div>
      )}

      {showTransferModal && (
        <motion.div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={closeModals}>
          <div className="bg-white p-6 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Transférer des fonds</h2>
            <div className="flex mb-4 space-x-2">
              {[500, 1000, 5000, 25000].map((value) => (
                <button
                  key={value}
                  className="bg-gray-200 p-2 rounded-lg"
                  onClick={() => setAmount(value)}
                  disabled={loading}
                >
                  {value.toLocaleString()} TND
                </button>
              ))}
            </div>
            <input 
              type="text" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              className="w-full border p-2 rounded-md mb-4" 
              placeholder="Montant" 
              disabled={loading} 
            />
            <div className="flex space-x-4">
              <button
                className="flex-1 bg-green-500 text-white p-2 rounded-lg"
                onClick={handleDeposit}
                disabled={loading}
              >
                Dépôt
              </button>
              <button
                className="flex-1 bg-red-500 text-white p-2 rounded-lg"
                onClick={handleWithdraw}
                disabled={loading}
              >
                Retrait
              </button>
            </div>
            <button className="mt-4 px-4 py-2 rounded" onClick={closeModals}>Annuler</button>
          </div>
        </motion.div>
      )}

      {showDeleteModal && (
        <motion.div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={closeModals}>
          <div className="bg-white p-6 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Supprimer l'utilisateur</h2>
            <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDelete}>Supprimer</button>
            <button className="ml-4 px-4 py-2 rounded" onClick={closeModals}>Annuler</button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserDetails;
