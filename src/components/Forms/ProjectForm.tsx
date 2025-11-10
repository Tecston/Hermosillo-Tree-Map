import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

interface ProjectFormProps {
  onClose: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onClose }) => {
  const { addProject } = useAppContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [institution, setInstitution] = useState('');
  const [status, setStatus] = useState<'planning' | 'in-progress' | 'completed'>('planning');
  const [imageUrl, setImageUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState<[number, number]>([19.432608, -99.133209]);

  // Nuevos campos de contacto
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactWebsite, setContactWebsite] = useState('');
  const [contactPurpose, setContactPurpose] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProject({
      title,
      description,
      institution,
      status,
      imageUrl: imageUrl || undefined,
      location,
      startDate,
      endDate: endDate || undefined,
      // Puedes guardar esto en el objeto del proyecto
      contactName,
      contactEmail,
      contactPhone,
      contactWebsite,
      contactPurpose
    });
    onClose();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Nuevo Proyecto Urbano</h2>
      <form onSubmit={handleSubmit}>
        {/* Información básica */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Ej: Renovación de Plaza Principal" required />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={4} placeholder="Describe el proyecto con detalle..." required />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Institución Responsable</label>
          <input type="text" value={institution} onChange={e => setInstitution(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Ej: Secretaría de Desarrollo Urbano" required />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado del Proyecto</label>
          <select value={status} onChange={e => setStatus(e.target.value as 'planning' | 'in-progress' | 'completed')} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            <option value="planning">Planeación</option>
            <option value="in-progress">En Progreso</option>
            <option value="completed">Completado</option>
          </select>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Finalización (est.)</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>

        {/* Ubicación */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
          <div className="flex space-x-2">
            <input type="number" value={location[0]} onChange={e => setLocation([parseFloat(e.target.value), location[1]])} className="w-1/2 px-3 py-2 border border-gray-300 rounded-md" placeholder="Latitud" step="0.000001" required />
            <input type="number" value={location[1]} onChange={e => setLocation([location[0], parseFloat(e.target.value)])} className="w-1/2 px-3 py-2 border border-gray-300 rounded-md" placeholder="Longitud" step="0.000001" required />
          </div>
          <p className="text-xs text-gray-500 mt-1">En una versión real, podrías seleccionar la ubicación directamente en el mapa</p>
        </div>

        {/* Imagen */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen (opcional)</label>
          <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="https://ejemplo.com/imagen.jpg" />
        </div>

        {/* Contacto del Responsable */}
        <h3 className="text-md font-semibold mb-2 mt-6 text-gray-800">Información de Contacto del Responsable</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
          <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Ej: Arq. Laura Mendoza" required />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
          <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="ejemplo@correo.com" required />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono (opcional)</label>
          <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="(000) 000-0000" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sitio web o red social (opcional)</label>
          <input type="url" value={contactWebsite} onChange={e => setContactWebsite(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="https://..." />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">¿Qué tipo de colaboración busca?</label>
          <textarea value={contactPurpose} onChange={e => setContactPurpose(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Ej: Buscamos financiamiento, preventa de lotes, alianzas con ONG..." rows={3} />
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Registrar Proyecto</button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
