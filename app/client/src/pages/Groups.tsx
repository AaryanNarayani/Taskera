/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Plus, ArrowRight, Search, X, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { group } from 'console';

const mockUsers = [
  { id: 1, name: "Ziyad", avatar: "Z", color: "bg-purple-500" },
  { id: 2, name: "Hassan", avatar: "H", color: "bg-blue-500" },
  { id: 3, name: "Ali", avatar: "A", color: "bg-green-500" },
  { id: 4, name: "Ahmed", avatar: "A", color: "bg-yellow-500" },
  { id: 5, name: "Hussein", avatar: "H", color: "bg-red-500" },
  { id: 6, name: "Sara", avatar: "S", color: "bg-pink-500" },
  { id: 7, name: "Salem", avatar: "S", color: "bg-indigo-500" },
  { id: 8, name: "Menna", avatar: "M", color: "bg-teal-500" },
  { id: 9, name: "Said", avatar: "S", color: "bg-orange-500" },
  { id: 10, name: "Hala", avatar: "H", color: "bg-cyan-500" },
  { id: 11, name: "Nour", avatar: "N", color: "bg-emerald-500" },
  { id: 12, name: "Rana", avatar: "R", color: "bg-violet-500" },
  { id: 13, name: "Karim", avatar: "K", color: "bg-amber-500" },
  { id: 14, name: "Layla", avatar: "L", color: "bg-lime-500" },
  { id: 15, name: "Omar", avatar: "O", color: "bg-fuchsia-500" },
];

export default function GroupsPage() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isUserModalOpen, setUserModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [currentGroupId, setCurrentGroupId] = useState<number | null>(null);
    
    const [newData, setNewData] = useState({
      name: "",
      description : "",
      members: {
        number: 0,
        users: [],
      },
      admin: "",
      category: ""
    });
    
    const [groups, setGroups] = useState([
      { 
        id: 1, 
        name: "Octaknight",
        description : "Very good group pls join" ,
        members: {
          number: 12,
          users: mockUsers.slice(0, 12)
        }, 
        admin: "Ziyad", 
        category: "Design" 
      },{ 
        id: 2, 
        name: "Octaknight",
        description : "Very good group pls join" ,
        members: {
          number: 12,
          users: mockUsers.slice(1, 5)
        }, 
        admin: "Ziyad", 
        category: "Design" 
      },{ 
        id: 3, 
        name: "Octaknight",
        description : "Very good group pls join" ,
        members: {
          number: 12,
          users: mockUsers.slice(0, 2)
        }, 
        admin: "Ziyad", 
        category: "Design" 
      },{ 
        id: 4, 
        name: "Octaknight",
        description : "Very good group pls join" ,
        members: {
          number: 12,
          users: mockUsers.slice(0, 1)
        }, 
        admin: "Ziyad", 
        category: "Design" 
      }
    ]);

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addNewGroup = () => {
    const newGroup = {
      id: groups.length + 1,
      name: newData.name || "New Group",
      members: {
        number: 0,
        users: []
      },
      description : newData.description || "",
      admin: newData.admin || "Ziyad",
      category: newData.category || "Design"
    };
    setGroups([...groups, newGroup]);
    setNewData({
      name: "",
      members: {
        number: 0,
        users: [],
      },
      description : "",
      admin: "",
      category: ""
    });
  };

  const openUserModal = (groupId: number) => {
    setCurrentGroupId(groupId);
    setSelectedUsers(groups[groupId - 1].members.users);
    setUserModalOpen(true);
  };

  const toggleUserSelection = (user: any) => {
    if (selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const addUsersToGroup = () => {
    if (currentGroupId === null) return;
    
    const updatedGroups = groups.map(group => {
      if (group.id === currentGroupId) {

        const existingUserIds = group.members.users.map((user: any) => user.id);
        const newUsers = selectedUsers.filter(user => !existingUserIds.includes(user.id));
        
        return {
          ...group,
          members: {
            number: group.members.number + newUsers.length,
            users: [...group.members.users, ...newUsers]
          }
        };
      }
      return group;
    });
    
    setGroups(updatedGroups);
    setUserModalOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="w-full bg-[--ternary] p-8">
      <div className="w-full mx-auto">
        <div className="flex items-center gap-6 mb-6">
          <h1 className="text-2xl font-bold text-white">Groups</h1>
          <button 
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-[--secondary] hover:bg-indigo-300 text-black py-2 px-4 rounded-md transition-colors"
          >
            <span>Add New Group</span>
            <Plus size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {groups.map((group) => (
            <GroupCard 
              key={group.id} 
              group={group} 
              onAddUsers={() => openUserModal(group.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Add New Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[--ternary] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-white">Add New Group</h2>
            <input
              type="text"
              placeholder="Group Name"
              value={newData.name}
              onChange={(e) => setNewData({ ...newData, name: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full bg-[--ternary] text-white"
            />
            <input
              type="text"
              placeholder="Description"
              value={newData.description}
              onChange={(e) => setNewData({ ...newData, description: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full bg-[--ternary] text-white"
            />
            <input
              type="text"
              placeholder="Category"
              value={newData.category}
              onChange={(e) => setNewData({ ...newData, category: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full bg-[--ternary] text-white"
            />
            <div className="flex justify-end">
              <button
                onClick={() => {
                  addNewGroup();
                  setModalOpen(false);
                }}
                className="bg-[--secondary] hover:bg-indigo-300 text-black py-2 px-4 rounded-md transition-colors"
              >
                Add Group
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Users Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[--ternary] rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Add Users to Group</h2>
              <button 
                onClick={() => setUserModalOpen(false)}
                className="text-gray-300 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Search Box */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-md pl-10 pr-3 py-2 w-full bg-[--ternary] text-white"
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            
            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Selected Users ({selectedUsers.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map(user => (
                    <div 
                      key={user.id} 
                      className="flex items-center gap-1 bg-gray-700 rounded-full pl-1 pr-2 py-0.5"
                    >
                      <div className={`${user.color} text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium`}>
                        {user.avatar}
                      </div>
                      <span className="text-sm text-white">{user.name}</span>
                      <button 
                        onClick={() => toggleUserSelection(user)}
                        className="text-gray-300 hover:text-white ml-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* User List */}
            <div className="max-h-64 overflow-y-auto mb-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Available Users</h3>
              <div className="space-y-1">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <div 
                      key={user.id} 
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                        selectedUsers.some(u => u.id === user.id) ? 'bg-gray-700' : 'hover:bg-gray-700'
                      }`}
                      onClick={() => toggleUserSelection(user)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`${user.color} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium`}>
                          {user.avatar}
                        </div>
                        <span className="text-white">{user.name}</span>
                      </div>
                      <span className="text-gray-400">
                        {selectedUsers.some(u => u.id === user.id) ? 'Selected' : ''}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-2">No users found</p>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end">
              <button
                onClick={addUsersToGroup}
                disabled={selectedUsers.length === 0}
                className={`flex items-center gap-2 py-2 px-4 rounded-md transition-colors ${
                  selectedUsers.length > 0 
                    ? 'bg-[--secondary] hover:bg-indigo-300 text-black' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>Add {selectedUsers.length} Users</span>
                <UserPlus size={18} />
              </button>
              <button
                onClick={() => setUserModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GroupCard({ group, onAddUsers }: { group: any, onAddUsers: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get the first 3 users for the avatar display
  const displayUsers = group.members.users.slice(0, 3);
  const remainingCount = Math.max(0, group.members.number - 3);

  return (
    <div className="relative">
      <Link 
        to={`/groups/${group.id}`} 
        className="bg-[#2B2D42] hover:bg-[#383a54] cursor-pointer bg-opacity-20 rounded-lg overflow-hidden w-[300px] shadow-xl relative block" 
        onMouseOver={() => setIsHovered(true)} 
        onMouseOut={() => setIsHovered(false)}
      >
        <div className="p-4 pb-2 mb-2 flex justify-between items-center bg-[--secondary] relative">
          <h2 className="text-lg font-medium text-black">{group.name}</h2>
          <button className="bg-[--secondary] bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 transition-colors absolute -bottom-4 right-4 shadow-lg">
            <ArrowRight size={20} className={`text-black ${isHovered ? '-rotate-45' : ''} transition-all duration-100`} />
          </button>
        </div>
        
        <div className="p-4 pt-3 pb-16 text-white text-sm space-y-1">
          <p>Total Members: {group.members.number}</p>
          <p>Admin: {group.admin}</p>
          <p>Category: {group.category}</p>
        </div>

        <div className="p-4 pt-0 flex items-center absolute bottom-2 left-2">
          <div className="flex -space-x-2">
            {displayUsers.map((user: any, index: number) => (
              <div 
                key={index} 
                className={`${user.color} text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border-2 border-[#2B2D42]`}
                title={user.name}
              >
                {user.avatar}
              </div>
            ))}
            {remainingCount > 0 && (
              <div className="bg-gray-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border-2 border-[#2B2D42]">
                +{remainingCount}
              </div>
            )}
          </div>
        </div>
      </Link>
      
      {/* Add users button */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAddUsers();
        }}
        className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg z-10"
        title="Add Users"
      >
        <UserPlus size={16} />
      </button>
    </div>
  );
}