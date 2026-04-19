import React, { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragStartEvent, type DragOverEvent, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { useCrmStore, type LeadStage, type Prospect } from '../../../store/crmStore';
import { PipelineColumn } from '../components/PipelineColumn';
import { LeadCard } from '../components/LeadCard';

const STAGES: { id: LeadStage; title: string }[] = [
  { id: 'new_lead', title: 'New Lead' },
  { id: 'contacted', title: 'Contacted' },
  { id: 'meeting', title: 'Meeting' },
  { id: 'proposal_sent', title: 'Proposal Sent' },
  { id: 'negotiation', title: 'Negotiation' },
  { id: 'won', title: 'Deal Won' },
  { id: 'lost', title: 'Lost' },
];

export const LeadPipeline: React.FC = () => {
  const prospects = useCrmStore(s => s.prospects);
  const updateProspectStage = useCrmStore(s => s.updateProspectStage);
  const updateProspectOrder = useCrmStore(s => s.updateProspectOrder);
  
  const [activeLead, setActiveLead] = useState<Prospect | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Lead') {
      setActiveLead(event.active.data.current.lead);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    if (activeId === overId) return;

    const isActiveLead = active.data.current?.type === 'Lead';
    const isOverLead = over.data.current?.type === 'Lead';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveLead) return;

    if (isOverLead) {
       const activeIndex = prospects.findIndex(t => t.id === activeId);
       const overIndex = prospects.findIndex(t => t.id === overId);
       
       if (prospects[activeIndex].stage !== prospects[overIndex].stage) {
         updateProspectStage(activeId as string, prospects[overIndex].stage);
       }
    }

    if (isOverColumn) {
       const activeIndex = prospects.findIndex(t => t.id === activeId);
       if (prospects[activeIndex].stage !== overId) {
         updateProspectStage(activeId as string, overId as LeadStage);
       }
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveLead(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveLead = active.data.current?.type === 'Lead';
    const isOverLead = over.data.current?.type === 'Lead';

    if (isActiveLead && isOverLead) {
        const activeIndex = prospects.findIndex(t => t.id === activeId);
        const overIndex = prospects.findIndex(t => t.id === overId);

        if (prospects[activeIndex].stage === prospects[overIndex].stage) {
            updateProspectOrder(arrayMove(prospects, activeIndex, overIndex));
        }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16)-2rem)] -m-4 md:-m-8 p-4 md:p-8 bg-background">
      <div className="shrink-0 mb-6 space-y-2 pl-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">Sales Pipeline</h1>
        <p className="text-zinc-400 mt-1">Drag and drop leads to update their sales stage.</p>
      </div>

      <div className="flex-1 flex overflow-x-auto overflow-y-hidden pt-2 pl-2">
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCorners} 
          onDragStart={onDragStart} 
          onDragOver={onDragOver} 
          onDragEnd={onDragEnd}
        >
          <div className="flex h-full items-start pb-4">
            {STAGES.map(stage => (
              <PipelineColumn 
                key={stage.id} 
                stage={stage.id} 
                title={stage.title} 
                leads={prospects.filter(p => p.stage === stage.id)} 
              />
            ))}
          </div>

          {createPortal(
            <DragOverlay>
              {activeLead && <LeadCard lead={activeLead} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </div>
  );
};
