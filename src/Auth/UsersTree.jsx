import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronRight, FaUser, FaEllipsisV } from 'react-icons/fa';
import Modal from 'react-modal';

// Configurer Modal
Modal.setAppElement('#root'); // Remplacez #root par l'élément de votre application

const UserTreeItem = ({ user, onUserSelect, isRoot = false, level = 0, openModals }) => {
    const [isOpen, setIsOpen] = useState(isRoot);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleMenuClick = () => {
        setIsModalOpen(true); // Ouvre le modal
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setIsModalOpen(false); // Ferme le modal
        switch (option) {
            case 'Modifier l\'utilisateur':
                openModals.openUpdateModal();
                break;
            case 'Transférer des utilisateurs':
                openModals.openTransferModal();
                break;
            case 'Ajouter un utilisateur':
                openModals.openAddUserModal();
                break;
            case 'Supprimer l\'utilisateur':
                openModals.openDeleteModal();
                break;
            default:
                console.log('Unknown option');
        }
    };

    return (
        <div className="mb-1 relative" style={{ paddingLeft: `${level * 15}px` }}>
            <div
                className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
                onClick={() => {
                    setIsOpen(!isOpen);
                    onUserSelect(user);
                }}
            >
                <div className="flex items-center space-x-2">
                    {user.children && (isOpen ? <FaChevronDown className="text-indigo-600" /> : <FaChevronRight className="text-indigo-600" />)}
                    <FaUser className="text-indigo-600" />
                    <span className="text-gray-800 font-semibold">{user.username}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <FaEllipsisV className="text-gray-500 cursor-pointer" onClick={handleMenuClick} />
                </div>
            </div>

            {isOpen && user.children && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    {user.children.map((child) => (
                        <UserTreeItem
                            key={child._id}
                            user={child}
                            onUserSelect={onUserSelect}
                            level={level + 1}
                            openModals={openModals}
                        />
                    ))}
                </motion.div>
            )}

            {/* Modal pour sélectionner une option */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Options de l'utilisateur"
                className="fixed inset-0 flex items-center justify-center z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <div className="bg-white rounded-lg p-4 shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">Sélectionnez une option</h2>
                    <ul className="text-sm text-gray-700">
                        <li className="px-4 py-2 mb-2 hover:bg-gray-100 cursor-pointer border" onClick={() => handleOptionSelect('Modifier l\'utilisateur')}>
                            Modifier l'utilisateur
                        </li>
                        <li className="px-4 py-2 mb-2 hover:bg-gray-100 cursor-pointer border" onClick={() => handleOptionSelect('Transférer des utilisateurs')}>
                            Transférer des utilisateurs
                        </li>
                     
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer border" onClick={() => handleOptionSelect('Supprimer l\'utilisateur')}>
                            Supprimer l'utilisateur
                        </li>
                    </ul>
                    {/* Conteneur pour centrer le bouton */}
                    <div className="flex justify-center mt-4">
                        <button className="bg-blue-600 px-4 py-2 text-white rounded" onClick={() => setIsModalOpen(false)}>
                            Fermer
                        </button>
                    </div>
                </div>

            </Modal>
        </div>
    );
};

export default UserTreeItem;
