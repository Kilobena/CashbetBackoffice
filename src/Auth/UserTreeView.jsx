// src/pages/UserTreeViewPage.jsx
import React, { useEffect, useState } from "react";
import UserTreeItem from "./UsersTree";
import Auth from "../service/Auth";
import transaction from "../service/Trunsuction";
import { useAuth } from '../providers/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const UserTreeViewPage = () => {
    const [userTreeData, setUserTreeData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [role, setRole] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [amount, setAmount] = useState(0);
    const navigate = useNavigate();
    const { updateUser } = useAuth();
    const authUser = useAuth();
    const authService = new Auth();
    const transactionService = new transaction();
    const roles = ["SuperAdmin", "Admin", "Partner", "Assistant", "User"];

    const openUpdateModal = () => {
        if (selectedUser) {
            setNewUsername(selectedUser.username);
            setRole(selectedUser.role);
            setShowUpdateModal(true);
        }
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
                const result = await authService.getUserById(authUser.user.user._id);
                if (result.success) {
                    setSelectedUser(result.user);
                    setNewUsername(result.user.username);
                    setRole(result.user.role);

                    const treeResult = await authService.getUsersByCreaterId(authUser.user.user._id);
                    if (treeResult.success) {
                        setUserTreeData(treeResult.user);
                    }
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                toast.error("Erreur lors de la récupération des utilisateurs.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [authUser]);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setNewUsername(user.username);
        setRole(user.role);
    };

    const handleUpdate = async () => {
        try {
            const updateResult = await authService.updateUser(selectedUser._id, { username: newUsername, password: newPassword, role });
            if (updateResult.success) {
                closeModals();
                if (selectedUser._id === authUser.user.user._id) {
                    updateUser({ ...authUser.user, role });
                }
                toast.success('Utilisateur mis à jour avec succès!');
                window.location.reload();
            } else {
                console.error("Error updating user:", updateResult.message);
                toast.error("Erreur lors de la mise à jour de l'utilisateur.");
            }
        } catch (error) {
            console.error("Error during update:", error);
            toast.error("Erreur lors de la mise à jour de l'utilisateur.");
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;

        const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?');
        if (confirmed) {
            setLoading(true);
            try {
                const result = await authService.deleteUserById(selectedUser._id);
                if (result.success) {
                    toast.success('Utilisateur supprimé avec succès');
                    setTimeout(() => navigate('/users'), 2000);
                } else {
                    toast.error('Erreur lors de la suppression : ' + result.message);
                }
            } catch (error) {
                toast.error('Erreur lors de la suppression.');
            } finally {
                setLoading(false);
                closeModals();
            }
        }
    };

    const handleDeposit = async () => {
        try {
            const response = await transactionService.makeTransfer(
                authUser.user.user._id,
                selectedUser._id,
                amount,
                "deposit",
                ""
            );
            if (response.success) {
                toast.success('Dépôt effectué avec succès!');
                setAmount(0); 
                closeModals(); 
            } else {
                toast.error(response.message || 'Erreur lors du dépôt.');
            }
        } catch (error) {
            console.error("Error during deposit:", error);
            toast.error('Erreur lors de la connexion au service de transfert.');
        }
    };

    const handleWithdraw = async () => {
        try {
            const response = await transactionService.makeTransfer(
                authUser.user.user._id,
                selectedUser._id,
                amount,
                "withdraw",
                ""
            );
            if (response.success) {
                toast.success('Retrait effectué avec succès!');
                setAmount(0); // Réinitialiser le montant après le retrait
                closeModals(); // Fermer le modal après la réussite
            } else {
                toast.error(response.message || 'Erreur lors du retrait.');
            }
        } catch (error) {
            console.error("Error during withdraw:", error);
            toast.error('Erreur lors de la connexion au service de transfert.');
        }
    };

    return (
        <div className="bg-gray-50 p-4 h-full shadow-lg overflow-y-auto w-full">
            <h3 className="text-xl font-bold mb-4">Arbre des utilisateurs</h3>
            {loading ? (
                <p>Chargement...</p>
            ) : userTreeData ? (
                <UserTreeItem
                    user={userTreeData}
                    onUserSelect={handleUserSelect}
                    menuOpenId={menuOpenId}
                    setMenuOpenId={setMenuOpenId}
                    openModals={{ openUpdateModal, openTransferModal, openDeleteModal }}
                />
            ) : (
                <p className="text-gray-500">Aucun utilisateur sous ce créateur.</p>
            )}

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

            {showDeleteModal && selectedUser && (
                <motion.div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={closeModals}>
                    <div className="bg-white p-6 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-4">Supprimer l'utilisateur</h2>
                        <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
                        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDelete}>Supprimer</button>
                        <button className="ml-4 px-4 py-2 rounded" onClick={closeModals}>Annuler</button>
                    </div>
                </motion.div>
            )}

            {showTransferModal && (
                <motion.div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={closeModals}>
                    <div className="bg-white p-6 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-4">Transfert d'argent</h2>
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
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full border p-2 rounded-md mb-4"
                            placeholder="Montant"
                        />
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleDeposit}>
                            Déposer
                        </button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded ml-4" onClick={handleWithdraw}>
                            Retirer
                        </button>
                        <button className="ml-4 px-4 py-2 rounded" onClick={closeModals}>Annuler</button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default UserTreeViewPage;
