import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiEye, FiEdit, FiTrash2, FiFilter, FiDownload } from 'react-icons/fi';

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  font-weight: 600;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  border-left: 4px solid ${props => props.color || '#007bff'};
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.color || '#007bff'};
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  min-width: 150px;
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  min-width: 250px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &.btn-primary {
    background: #007bff;
    color: white;
    
    &:hover {
      background: #0056b3;
    }
  }
  
  &.btn-secondary {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #545b62;
    }
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background: #f8f9fa;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e9ecef;
`;

const Td = styled.td`
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
`;

const StatusBadge = styled.span`
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  
  &.status-new {
    background: #d4edda;
    color: #155724;
  }
  
  &.status-contacted {
    background: #fff3cd;
    color: #856404;
  }
  
  &.status-qualified {
    background: #cce5ff;
    color: #004085;
  }
  
  &.status-converted {
    background: #d1ecf1;
    color: #0c5460;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 3px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &.view {
    color: #007bff;
  }
  
  &.edit {
    color: #ffc107;
  }
  
  &.delete {
    color: #dc3545;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingLead, setEditingLead] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'leads'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const leadsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLeads(leadsData);
        setFilteredLeads(leadsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching leads:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = leads;
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(lead => lead.status === filterStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredLeads(filtered);
  }, [leads, filterStatus, searchTerm]);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await updateDoc(doc(db, 'leads', leadId), {
        status: newStatus
      });
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleEditLead = async (e) => {
    e.preventDefault();
    
    try {
      await updateDoc(doc(db, 'leads', editingLead.id), {
        name: editingLead.name,
        email: editingLead.email,
        phone: editingLead.phone,
        company: editingLead.company,
        inquiry: editingLead.inquiry,
        status: editingLead.status
      });
      
      setShowModal(false);
      setEditingLead(null);
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const exportLeads = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Company', 'Inquiry', 'Status', 'Date'],
      ...filteredLeads.map(lead => [
        lead.name || '',
        lead.email || '',
        lead.phone || '',
        lead.company || '',
        lead.inquiry || '',
        lead.status || '',
        lead.timestamp?.toDate?.()?.toLocaleDateString() || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStats = () => {
    const total = leads.length;
    const newLeads = leads.filter(lead => lead.status === 'new').length;
    const contacted = leads.filter(lead => lead.status === 'contacted').length;
    const converted = leads.filter(lead => lead.status === 'converted').length;
    
    return { total, newLeads, contacted, converted };
  };

  const stats = getStats();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>Lead Management Dashboard</Title>
        <Button className="btn-primary" onClick={exportLeads}>
          <FiDownload />
          Export Leads
        </Button>
      </Header>

      <StatsContainer>
        <StatCard color="#007bff">
          <StatNumber color="#007bff">{stats.total}</StatNumber>
          <StatLabel>Total Leads</StatLabel>
        </StatCard>
        <StatCard color="#28a745">
          <StatNumber color="#28a745">{stats.newLeads}</StatNumber>
          <StatLabel>New Leads</StatLabel>
        </StatCard>
        <StatCard color="#ffc107">
          <StatNumber color="#ffc107">{stats.contacted}</StatNumber>
          <StatLabel>Contacted</StatLabel>
        </StatCard>
        <StatCard color="#17a2b8">
          <StatNumber color="#17a2b8">{stats.converted}</StatNumber>
          <StatLabel>Converted</StatLabel>
        </StatCard>
      </StatsContainer>

      <ControlsContainer>
        <FilterSelect
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
        </FilterSelect>
        
        <SearchInput
          type="text"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </ControlsContainer>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Company</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <Td>{lead.name}</Td>
                <Td>{lead.email}</Td>
                <Td>{lead.company}</Td>
                <Td>
                  <FilterSelect
                    value={lead.status || 'new'}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    style={{ minWidth: '120px' }}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                  </FilterSelect>
                </Td>
                <Td>
                  {lead.timestamp?.toDate?.()?.toLocaleDateString() || 'N/A'}
                </Td>
                <Td>
                  <ActionButtons>
                    <ActionButton
                      className="view"
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowModal(true);
                      }}
                    >
                      <FiEye />
                    </ActionButton>
                    <ActionButton
                      className="edit"
                      onClick={() => {
                        setEditingLead(lead);
                        setShowModal(true);
                      }}
                    >
                      <FiEdit />
                    </ActionButton>
                  </ActionButtons>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingLead ? 'Edit Lead' : 'Lead Details'}
              </ModalTitle>
              <CloseButton onClick={() => {
                setShowModal(false);
                setSelectedLead(null);
                setEditingLead(null);
              }}>
                ×
              </CloseButton>
            </ModalHeader>

            {editingLead ? (
              <form onSubmit={handleEditLead}>
                <FormGroup>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={editingLead.name || ''}
                    onChange={(e) => setEditingLead({
                      ...editingLead,
                      name: e.target.value
                    })}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editingLead.email || ''}
                    onChange={(e) => setEditingLead({
                      ...editingLead,
                      email: e.target.value
                    })}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={editingLead.phone || ''}
                    onChange={(e) => setEditingLead({
                      ...editingLead,
                      phone: e.target.value
                    })}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Company</Label>
                  <Input
                    type="text"
                    value={editingLead.company || ''}
                    onChange={(e) => setEditingLead({
                      ...editingLead,
                      company: e.target.value
                    })}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Inquiry</Label>
                  <TextArea
                    value={editingLead.inquiry || ''}
                    onChange={(e) => setEditingLead({
                      ...editingLead,
                      inquiry: e.target.value
                    })}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Status</Label>
                  <FilterSelect
                    value={editingLead.status || 'new'}
                    onChange={(e) => setEditingLead({
                      ...editingLead,
                      status: e.target.value
                    })}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                  </FilterSelect>
                </FormGroup>
                
                <Button type="submit" className="btn-primary">
                  Update Lead
                </Button>
              </form>
            ) : (
              <div>
                <FormGroup>
                  <Label>Name</Label>
                  <div>{selectedLead?.name}</div>
                </FormGroup>
                
                <FormGroup>
                  <Label>Email</Label>
                  <div>{selectedLead?.email}</div>
                </FormGroup>
                
                <FormGroup>
                  <Label>Phone</Label>
                  <div>{selectedLead?.phone || 'N/A'}</div>
                </FormGroup>
                
                <FormGroup>
                  <Label>Company</Label>
                  <div>{selectedLead?.company || 'N/A'}</div>
                </FormGroup>
                
                <FormGroup>
                  <Label>Inquiry</Label>
                  <div>{selectedLead?.inquiry}</div>
                </FormGroup>
                
                <FormGroup>
                  <Label>Status</Label>
                  <div>{selectedLead?.status || 'new'}</div>
                </FormGroup>
                
                <FormGroup>
                  <Label>Date</Label>
                  <div>
                    {selectedLead?.timestamp?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  </div>
                </FormGroup>
              </div>
            )}
          </ModalContent>
        </Modal>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;

