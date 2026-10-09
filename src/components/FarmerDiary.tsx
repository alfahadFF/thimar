import React, { useState, useMemo } from 'react';
import { 
  FarmerDiaryTask, 
  CropSeasonBudget, 
  BudgetItem, 
  CropRevenueItem, 
  AgronomyFieldRecord, 
  LivestockHerdRecord, 
  AquaculturePondRecord, 
  LabAnalysisRecord 
} from '../types';
import { 
  INITIAL_CROP_BUDGETS, 
  INITIAL_FIELD_RECORDS, 
  INITIAL_LIVESTOCK_RECORDS, 
  INITIAL_AQUACULTURE_RECORDS, 
  INITIAL_LAB_RECORDS 
} from '../data/mockData';
import { CropBudgetSection } from './CropBudgetSection';
import { SpecializedRecordsSection } from './SpecializedRecordsSection';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Trash2, 
  AlertCircle, 
  Printer, 
  Sparkles, 
  Droplet, 
  Sprout, 
  Fish, 
  Wrench, 
  Filter, 
  CheckSquare, 
  Square,
  X,
  FileText,
  DollarSign,
  Layers,
  ArrowRight
} from 'lucide-react';

interface FarmerDiaryProps {
  tasks: FarmerDiaryTask[];
  onAddTask: (task: FarmerDiaryTask) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  initialSubTab?: 'tasks' | 'budget' | 'records';
}

export const FarmerDiary: React.FC<FarmerDiaryProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  initialSubTab = 'tasks'
}) => {
  const [diarySubTab, setDiarySubTab] = useState<'tasks' | 'budget' | 'records'>(initialSubTab);

  // Budget & Specialized Records State
  const [budgets, setBudgets] = useState<CropSeasonBudget[]>(INITIAL_CROP_BUDGETS);
  const [fieldRecords, setFieldRecords] = useState<AgronomyFieldRecord[]>(INITIAL_FIELD_RECORDS);
  const [livestockRecords, setLivestockRecords] = useState<LivestockHerdRecord[]>(INITIAL_LIVESTOCK_RECORDS);
  const [aquacultureRecords, setAquacultureRecords] = useState<AquaculturePondRecord[]>(INITIAL_AQUACULTURE_RECORDS);
  const [labRecords, setLabRecords] = useState<LabAnalysisRecord[]>(INITIAL_LAB_RECORDS);

  // Budget Handlers
  const handleAddBudgetSeason = (newSeason: CropSeasonBudget) => {
    setBudgets(prev => [newSeason, ...prev]);
  };

  const handleAddCostItem = (seasonId: string, item: BudgetItem) => {
    setBudgets(prev => prev.map(b => b.id === seasonId ? { ...b, costItems: [item, ...b.costItems] } : b));
  };

  const handleAddRevenueItem = (seasonId: string, item: CropRevenueItem) => {
    setBudgets(prev => prev.map(b => b.id === seasonId ? { ...b, revenueItems: [item, ...b.revenueItems] } : b));
  };

  const handleDeleteCostItem = (seasonId: string, itemId: string) => {
    setBudgets(prev => prev.map(b => b.id === seasonId ? { ...b, costItems: b.costItems.filter(c => c.id !== itemId) } : b));
  };

  const handleDeleteRevenueItem = (seasonId: string, itemId: string) => {
    setBudgets(prev => prev.map(b => b.id === seasonId ? { ...b, revenueItems: b.revenueItems.filter(r => r.id !== itemId) } : b));
  };

  // Specialized Records Handlers
  const handleAddFieldRecord = (rec: AgronomyFieldRecord) => {
    setFieldRecords(prev => [rec, ...prev]);
  };

  const handleAddLivestockRecord = (rec: LivestockHerdRecord) => {
    setLivestockRecords(prev => [rec, ...prev]);
  };

  const handleAddAquacultureRecord = (rec: AquaculturePondRecord) => {
    setAquacultureRecords(prev => [rec, ...prev]);
  };

  const handleAddLabRecord = (rec: LabAnalysisRecord) => {
    setLabRecords(prev => [rec, ...prev]);
  };

  const handleDeleteSpecializedRecord = (type: 'field' | 'livestock' | 'aquaculture' | 'lab', id: string) => {
    if (type === 'field') setFieldRecords(prev => prev.filter(r => r.id !== id));
    if (type === 'livestock') setLivestockRecords(prev => prev.filter(r => r.id !== id));
    if (type === 'aquaculture') setAquacultureRecords(prev => prev.filter(r => r.id !== id));
    if (type === 'lab') setLabRecords(prev => prev.filter(r => r.id !== id));
  };

  // Task Subtab States
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newSector, setNewSector] = useState<FarmerDiaryTask['sector']>('crops');
  const [newCategory, setNewCategory] = useState<FarmerDiaryTask['category']>('fertilization');
  const [newTargetName, setNewTargetName] = useState('');
  const [newDueDate, setNewDueDate] = useState('2026-10-10');
  const [newTimeSlot, setNewTimeSlot] = useState('07:00 ص');
  const [newPriority, setNewPriority] = useState<FarmerDiaryTask['priority']>('medium');
  const [newNotes, setNewNotes] = useState('');
  const [newCost, setNewCost] = useState<number | undefined>(undefined);

  // Quick preset templates
  const quickTemplates = [
    {
      title: 'ري وحقن دفعة سماد NPK 20-20-20 بالخراطيم',
      sector: 'crops' as const,
      category: 'fertilization' as const,
      targetName: 'حقل الطماطم والخيار المحمي',
      timeSlot: '06:00 ص',
      priority: 'high' as const,
      notes: 'إذابة 20 كجم سماد متوازن مع 5 كجم هيوميك أسيد لتنشيط الجذور.',
      cost: 45
    },
    {
      title: 'تحصين الأغنام والمواليد ضد التسمم الدموي والمعوي',
      sector: 'livestock' as const,
      category: 'vaccination' as const,
      targetName: 'حظيرة خراف العواسي والنعيمي',
      timeSlot: '08:30 ص',
      priority: 'high' as const,
      notes: 'حقن تحت الجلد مع تطهير موضع الإبرة ومراجعة صلاحية اللقاح وسلسلة التبريد.',
      cost: 75
    },
    {
      title: 'قياس الأكسجين الذائب (DO) وتدوير بدالات الحوض',
      sector: 'aquaculture' as const,
      category: 'maintenance' as const,
      targetName: 'أحواض استزراع سمك البلطي رقم 1 و 2',
      timeSlot: '05:30 ص',
      priority: 'high' as const,
      notes: 'التأكد من أن القراءة تتجاوز 5 ملغم/لتر قبل تقديم أول وجبة علف صباحية.',
      cost: 0
    },
    {
      title: 'فحص مصائد سوسة النخيل وتغيير الفيرمون الكيرموني',
      sector: 'crops' as const,
      category: 'pest_control' as const,
      targetName: 'بستان نخيل البرحي والمجدول',
      timeSlot: '09:00 ص',
      priority: 'medium' as const,
      notes: 'تفريغ المصائد وإحصاء الحشرات لتقييم الكثافة الحشرية الأسبوعية.',
      cost: 15
    }
  ];

  const handleApplyTemplate = (tmpl: typeof quickTemplates[0]) => {
    const today = new Date().toISOString().split('T')[0];
    const createdTask: FarmerDiaryTask = {
      id: `task-${Date.now()}`,
      title: tmpl.title,
      sector: tmpl.sector,
      category: tmpl.category,
      targetName: tmpl.targetName,
      dueDate: today,
      timeSlot: tmpl.timeSlot,
      priority: tmpl.priority,
      completed: false,
      notes: tmpl.notes,
      cost: tmpl.cost
    };
    onAddTask(createdTask);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTargetName) return;

    const createdTask: FarmerDiaryTask = {
      id: `task-${Date.now()}`,
      title: newTitle,
      sector: newSector,
      category: newCategory,
      targetName: newTargetName,
      dueDate: newDueDate,
      timeSlot: newTimeSlot,
      priority: newPriority,
      completed: false,
      notes: newNotes,
      cost: newCost
    };

    onAddTask(createdTask);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewTargetName('');
    setNewNotes('');
    setNewCost(undefined);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSector = selectedSector === 'all' || t.sector === selectedSector;
      const matchStatus = statusFilter === 'all' || (statusFilter === 'completed' ? t.completed : !t.completed);
      return matchSector && matchStatus;
    });
  }, [tasks, selectedSector, statusFilter]);

  const totalCompleted = tasks.filter(t => t.completed).length;
  const completionPercentage = tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0;
  const highPriorityPending = tasks.filter(t => !t.completed && t.priority === 'high').length;
  const totalCost = tasks.reduce((sum, t) => sum + (t.cost || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <span>منظومة مفكرة المزارع والمربي الشاملة</span>
            <span aria-hidden="true">·</span>
            <span>مهام حقلية · ميزانيات المحاصيل ($) · سجلات الاختصاصات</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            مفكرة المزارع والمربي الميدانية
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            إدارة متكاملة للعمليات اليومية، متابعة التكاليف المتوقعة مقابل المبيعات المحققة، ونماذج توثيق متوافقة مع اختصاصات الزراعة والبيطرة والأسماك والمختبرات.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            title="طباعة التقرير"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>طباعة السجل</span>
          </button>

          {diarySubTab === 'tasks' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مهمة حقلية</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Main Mode Switcher in Farmer's Diary */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-xl border border-stone-200 text-xs font-semibold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setDiarySubTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            diarySubTab === 'tasks' ? 'bg-emerald-800 text-white shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>جدول العمليات والمهام اليومية ({tasks.length})</span>
        </button>

        <button
          onClick={() => setDiarySubTab('budget')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            diarySubTab === 'budget' ? 'bg-emerald-800 text-white shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>إدارة ميزانية المحاصيل والمواسم ($)</span>
        </button>

        <button
          onClick={() => setDiarySubTab('records')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            diarySubTab === 'records' ? 'bg-emerald-800 text-white shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>نماذج التسجيل المتوافقة مع الاختصاصات</span>
        </button>
      </div>

      {/* Render Subtab 2: Crop Budget Section */}
      {diarySubTab === 'budget' && (
        <CropBudgetSection
          budgets={budgets}
          onAddSeason={handleAddBudgetSeason}
          onAddCostItem={handleAddCostItem}
          onAddRevenueItem={handleAddRevenueItem}
          onDeleteCostItem={handleDeleteCostItem}
          onDeleteRevenueItem={handleDeleteRevenueItem}
        />
      )}

      {/* Render Subtab 3: Specialized Registration Records Section */}
      {diarySubTab === 'records' && (
        <SpecializedRecordsSection
          fieldRecords={fieldRecords}
          livestockRecords={livestockRecords}
          aquacultureRecords={aquacultureRecords}
          labRecords={labRecords}
          onAddFieldRecord={handleAddFieldRecord}
          onAddLivestockRecord={handleAddLivestockRecord}
          onAddAquacultureRecord={handleAddAquacultureRecord}
          onAddLabRecord={handleAddLabRecord}
          onDeleteRecord={handleDeleteSpecializedRecord}
        />
      )}

      {/* Render Subtab 1: Daily Tasks Management */}
      {diarySubTab === 'tasks' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Progress & KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-stone-200 rounded-xl">
              <span className="text-[11px] text-stone-500 font-medium block">إجمالي العمليات المسجلة</span>
              <div className="text-2xl font-extrabold text-stone-900 tabular-nums mt-1">{tasks.length} مهمة</div>
              <span className="text-[10px] text-stone-400">سجل هذا الأسبوع</span>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-xl">
              <span className="text-[11px] text-stone-500 font-medium block">نسبة الإنجاز الحقلي</span>
              <div className="text-2xl font-extrabold text-emerald-800 tabular-nums mt-1">{completionPercentage}%</div>
              <span className="text-[10px] text-emerald-700 font-medium">{totalCompleted} مهمة مكتملة</span>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-xl">
              <span className="text-[11px] text-stone-500 font-medium block">مهام عاجلة قيد الانتظار</span>
              <div className="text-2xl font-extrabold text-rose-700 tabular-nums mt-1">{highPriorityPending}</div>
              <span className="text-[10px] text-rose-600 font-medium">تحتاج تدخلاً سريعاً</span>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-xl">
              <span className="text-[11px] text-stone-500 font-medium block">المصروفات المسجلة للعمليات</span>
              <div className="text-2xl font-extrabold text-stone-900 tabular-nums mt-1">${totalCost.toLocaleString()}</div>
              <span className="text-[10px] text-stone-400">أسمدة وأدوية وأعلاف (بالدولار $)</span>
            </div>
          </div>

          {/* Quick 1-Click Action Templates */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>قوالب مهام جاهزة (إضافة بنقرة واحدة إلى مفكرتك اليوم):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {quickTemplates.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="p-3 bg-white hover:bg-emerald-100/50 border border-emerald-200/80 rounded-xl text-right transition-all hover:shadow-xs cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 block">
                      {tmpl.sector === 'crops' ? 'محاصيل' : tmpl.sector === 'livestock' ? 'مواشي' : 'أسماك'}
                    </span>
                    <h5 className="text-xs font-bold text-stone-900 group-hover:text-emerald-900 line-clamp-2">
                      {tmpl.title}
                    </h5>
                  </div>
                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span>الوقت: {tmpl.timeSlot}</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-0.5">
                      + إضافة
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filtering Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            
            {/* Sector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
              <span className="text-stone-500 font-semibold ml-1 whitespace-nowrap">القطاع:</span>
              {[
                { id: 'all', label: 'كافة القطاعات' },
                { id: 'crops', label: 'محاصيل ونخيل' },
                { id: 'livestock', label: 'ثروة حيوانية' },
                { id: 'aquaculture', label: 'استزراع سمكي' },
                { id: 'engineering', label: 'هندسة وري' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSector(s.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    selectedSector === s.id
                      ? 'bg-stone-800 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'all' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                الكل ({tasks.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'pending' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                قيد الانتظار ({tasks.length - totalCompleted})
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'completed' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                مكتملة ({totalCompleted})
              </button>
            </div>

          </div>

          {/* Task Cards List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-16 bg-white border border-dashed border-stone-300 rounded-2xl p-8">
                <CheckCircle2 className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-stone-700">لا توجد مهام تطابق هذا التصنيف</h4>
                <p className="text-xs text-stone-500 mt-1">أضف مهمة حقلية جديدة لتوثيق عملياتك اليومية.</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    task.completed
                      ? 'bg-stone-50/70 border-stone-200 opacity-75'
                      : 'bg-white border-stone-200 shadow-xs hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    
                    {/* Completion Checkbox */}
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 text-stone-400 hover:text-emerald-700 transition-colors cursor-pointer shrink-0"
                      title={task.completed ? 'وضع علامة غير مكتمل' : 'وضع علامة مكتمل'}
                    >
                      {task.completed ? (
                        <CheckSquare className="w-5 h-5 text-emerald-700" />
                      ) : (
                        <Square className="w-5 h-5 text-stone-400" />
                      )}
                    </button>

                    {/* Task Content */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.priority === 'high'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : task.priority === 'medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}>
                          {task.priority === 'high' ? 'عاجل وهام' : task.priority === 'medium' ? 'متوسط' : 'عادي'}
                        </span>

                        <span className="font-semibold text-emerald-900">
                          {task.targetName}
                        </span>

                        {task.cost !== undefined && task.cost > 0 && (
                          <span className="text-[11px] text-stone-500 tabular-nums">
                            التكلفة: ${task.cost}
                          </span>
                        )}

                        {task.completed && task.completedAt && (
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                            أُنجزت: {task.completedAt}
                          </span>
                        )}
                      </div>

                      <h4 className={`text-sm font-bold text-stone-900 leading-snug ${task.completed ? 'line-through text-stone-500' : ''}`}>
                        {task.title}
                      </h4>

                      {task.notes && (
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {task.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Timing & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 text-xs shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-stone-700 font-semibold tabular-nums">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>{task.dueDate}</span>
                      </div>
                      {task.timeSlot && (
                        <div className="flex items-center gap-1 text-stone-500 text-[11px]">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>{task.timeSlot}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="حذف المهمة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Add Task Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
              <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 space-y-4 border border-stone-200">
                  
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-stone-900">إضافة عملية حقلية إلى المفكرة</h3>
                      <p className="text-xs text-stone-500">جدولة الري، التسميد، التطعيم، أو مكافحة الآفات</p>
                    </div>
                    <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">عنوان المهمة أو العملية:</label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="مثال: ري حقل الطماطم مع حقن سلفات البوتاسيوم"
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">القطاع:</label>
                        <select
                          value={newSector}
                          onChange={(e) => setNewSector(e.target.value as any)}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                        >
                          <option value="crops">محاصيل ونخيل</option>
                          <option value="livestock">ثروة حيوانية ودواجن</option>
                          <option value="aquaculture">استزراع سمكي</option>
                          <option value="engineering">هندسة وشبكات ري</option>
                          <option value="general">عمليات عامة</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">نوع العملية:</label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value as any)}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                        >
                          <option value="irrigation">ري ومياه</option>
                          <option value="fertilization">تسميد وتغذية</option>
                          <option value="vaccination">تحصين وبيطرة</option>
                          <option value="pest_control">مكافحة آفات ووقاية</option>
                          <option value="feeding">تغذية وأعلاف</option>
                          <option value="harvest">حصاد وجمع محصول</option>
                          <option value="maintenance">صيانة دورية</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">الموقع أو الحقل أو الحظيرة المستهدفة:</label>
                      <input
                        type="text"
                        required
                        value={newTargetName}
                        onChange={(e) => setNewTargetName(e.target.value)}
                        placeholder="مثال: قطاع A - بستان البرحي / حظيرة خراف التسمين رقم 3"
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">تاريخ الاستحقاق:</label>
                        <input
                          type="date"
                          required
                          value={newDueDate}
                          onChange={(e) => setNewDueDate(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">الفترة الزمنية المفضلة:</label>
                        <input
                          type="text"
                          value={newTimeSlot}
                          onChange={(e) => setNewTimeSlot(e.target.value)}
                          placeholder="مثال: 06:30 ص أو بعد العصر"
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">الأولوية:</label>
                        <select
                          value={newPriority}
                          onChange={(e) => setNewPriority(e.target.value as any)}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                        >
                          <option value="high">عاجل وهام جداً</option>
                          <option value="medium">متوسط الأهمية</option>
                          <option value="low">عادي / مرن</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">التكلفة التقديرية بالدولار ($):</label>
                        <input
                          type="number"
                          value={newCost || ''}
                          onChange={(e) => setNewCost(e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">تعليمات وملاحظات فنية:</label>
                      <textarea
                        rows={2}
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                        placeholder="الكميات، المعايير، تعليمات الأمان..."
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>

                    <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddModalOpen(false)}
                        className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 font-semibold cursor-pointer"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold transition-colors cursor-pointer shadow-sm"
                      >
                        حفظ المهمة في المفكرة
                      </button>
                    </div>

                  </form>

                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
