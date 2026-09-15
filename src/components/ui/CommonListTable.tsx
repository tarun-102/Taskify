import React from "react";
import { FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Dropdown } from "react-bootstrap";
import { toast } from "react-toastify";

export interface TableColumn<T> {
  className: string;
  render: (item: T, MobileActionMenu?: React.ReactNode) => React.ReactNode;
}

interface CommonListTableProps<T> {
  items: T[];
  emptyMessage?: string;
  keyExtractor: (item: T) => string;
  columns: TableColumn<T>[];
  
  // Permissions and Action Handlers
  currentUserId?: string;
  getOwnerId?: (item: T) => string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  editDeniedMsg?: string;
  deleteDeniedMsg?: string;
}


const CustomToggle = React.forwardRef(({ children, onClick }: any, ref: any) => (
  <button
    ref={ref}
    onClick={(e) => { 
      e.preventDefault(); 
      onClick(e); 
    }}
    className="btn btn-light btn-sm border-0 bg-transparent text-secondary p-2 d-flex align-items-center justify-content-center rounded-circle"
  >
    {children}
  </button>
));

export function CommonListTable<T>({
  items,
  emptyMessage = "No items found.",
  keyExtractor,
  columns,
  currentUserId,
  getOwnerId,
  onEdit,
  onDelete,
  editDeniedMsg = "Access Denied!",
  deleteDeniedMsg = "Access Denied!"
}: CommonListTableProps<T>) {

  
  if (items.length === 0) {
    return <div className="text-center text-muted py-5">{emptyMessage}</div>;
  }

  
  const ActionMenu = ({ item }: { item: T }) => {
    
    const isOwner = getOwnerId ? getOwnerId(item) === currentUserId : true;

    const handleEditClick = () => {
      if (!isOwner) { 
        toast.error(editDeniedMsg); 
        return; 
      }
      if (onEdit) onEdit(item);
    };

    const handleDeleteClick = () => {
      if (!isOwner) { 
        toast.error(deleteDeniedMsg); 
        return; 
      }
      if (onDelete) onDelete(item);
    };


    if (!onEdit && !onDelete) return null;

    return (
      <Dropdown align="end">
        <Dropdown.Toggle as={CustomToggle}>
          <FiMoreVertical size={20} />
        </Dropdown.Toggle>
        <Dropdown.Menu className="shadow-lg border-0 rounded-3 mt-1">
          {onEdit && (
            <Dropdown.Item onClick={handleEditClick} className="d-flex align-items-center gap-2 py-2 small fw-medium">
              <FiEdit2 size={16} className="text-secondary" /> Edit
            </Dropdown.Item>
          )}
          {onEdit && onDelete && <Dropdown.Divider />}
          {onDelete && (
            <Dropdown.Item onClick={handleDeleteClick} className="d-flex align-items-center gap-2 py-2 small fw-medium text-danger">
              <FiTrash2 size={16} /> Delete
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  return (
    <div className="pb-2">
      {items.map((item) => (
        <div key={keyExtractor(item)} className="row g-0 align-items-center py-3 px-3 px-md-4 border-bottom transition-all">
          {columns.map((col, index) => (
            <div key={index} className={col.className}>
              {/* Render column content, injecting the mobile action menu into the render function if needed */}
              {col.render(item, <div className="d-md-none"><ActionMenu item={item} /></div>)}
            </div>
          ))}
          {(onEdit || onDelete) && (
            <div className="d-none d-md-flex col-md-1 justify-content-end">
              <ActionMenu item={item} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}