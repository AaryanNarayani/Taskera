import { useState } from 'react';
import { Plus, ArrowUpRight, ArrowRight } from 'lucide-react';

export default function GroupsPage() {
  const [groups, setGroups] = useState([
    { id: 1, name: "Octaknight", members: 12, admin: "Ziyad", category: "Design" },
    { id: 2, name: "Major Project", members: 12, admin: "Ziyad", category: "Design" },
    { id: 3, name: "Octaknight", members: 12, admin: "Ziyad", category: "Design" },
    { id: 4, name: "Octaknight", members: 12, admin: "Ziyad", category: "Design" },
    { id: 5, name: "Octaknight", members: 12, admin: "Ziyad", category: "Design" },
    { id: 6, name: "Octaknight", members: 12, admin: "Ziyad", category: "Design" },
  ]);

  const addNewGroup = () => {
    // Function to add a new group
    const newGroup = {
      id: groups.length + 1,
      name: "New Group",
      members: 1,
      admin: "Ziyad",
      category: "Design"
    };
    setGroups([...groups, newGroup]);
  };

  return (
    <div className="w-full bg-[--ternary] p-8">
      <div className="w-full mx-auto">
        <div className="flex items-center gap-6 mb-6">
          <h1 className="text-2xl font-bold text-white">Groups</h1>
          <button 
            onClick={addNewGroup}
            className="flex items-center gap-2 bg-[--secondary] hover:bg-indigo-300 text-black py-2 px-4 rounded-md transition-colors"
          >
            <span>Add New Group</span>
            <Plus size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </div>
    </div>
  );
}

function GroupCard({ group } : any) {
    const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="bg-[#2B2D42] cursor-pointer bg-opacity-20 rounded-lg overflow-hidden w-[300px] shadow-xl relative" onMouseOver={() => setIsHovered(true)} onMouseOut={() => setIsHovered(false)} >
      <div className="p-4 pb-2 mb-2 flex justify-between items-center bg-[--secondary] relative">
        <h2 className="text-lg font-medium text-black">{group.name}</h2>
        <button  className={`bg-[--secondary] bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 transition-colors absolute -bottom-4 right-4 shadow-x`}>
          <ArrowRight size={20} className={`text-black ${isHovered ? '-rotate-45' : ''} transition-all duration-100`}  />
        </button>
      </div>
      
      <div className="p-4 pt-3 pb-7 text-white text-sm space-y-1">
        <p>Total Members : {group.members}</p>
        <p>Admin : {group.admin}</p>
        <p>Category : {group.category}</p>
      </div>

      <div className="p-4 pt-0 flex items-center absolute bottom-0 right-0">
        <div className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">A</div>
        <div className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">B</div>
        <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">10+</div>
      </div>
    </div>
  );
}