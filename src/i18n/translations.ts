export type Language = 'en' | 'zh' | 'ja';

export interface TranslationSchema {
  siteName: string;
  subTitle: string;
  nav: {
    calendar: string;
    inbox: string;
    journal: string;
    statistics: string;
    settings: string;
  };
  header: {
    quickAdd: string;
    task: string;
    today: string;
  };
  settings: {
    title: string;
    subtitle: string;
    languageSection: string;
    languageDesc: string;
    languages: {
      en: string;
      zh: string;
      ja: string;
    };
    backupSection: string;
    backupDesc: string;
    exportBtn: string;
    importBtn: string;
    resetSection: string;
    resetDesc: string;
    clearBtn: string;
    confirmImportTitle: string;
    confirmImportDesc: (todos: number, entries: number) => string;
    mergeBtn: string;
    overwriteBtn: string;
    cancelBtn: string;
    confirmClearTitle: string;
    confirmClearDesc: string;
    yesDeleteAll: string;
  };
  quickAddModal: {
    title: string;
    taskTitlePlaceholder: string;
    taskDescPlaceholder: string;
    dateLabel: string;
    inboxOption: string;
    priorityLabel: string;
    priorities: {
      high: string;
      medium: string;
      low: string;
    };
    tagsPlaceholder: string;
    save: string;
    cancel: string;
  };
  calendar: {
    viewMonth: string;
    viewWeek: string;
    viewDay: string;
    today: string;
    noTasks: string;
    completed: string;
    addTask: string;
  };
  journal: {
    newEntry: string;
    searchPlaceholder: string;
    noEntries: string;
    writeFirst: string;
    saveEntry: string;
    back: string;
    mood: string;
    addTag: string;
    titlePlaceholder: string;
    deleteTitle: string;
    entriesCount: (count: number) => string;
    noMatchingEntries: string;
    adjustQueryOrFilters: string;
  };
  statistics: {
    title: string;
    subtitle: string;
    streak: string;
    streakActive: string;
    todaySummary: string;
    completionRate: string;
    tasksDone: string;
    journalWritten: string;
    weeklyActivity: string;
    completedTasksPerDay: string;
    monthlyOverview: string;
    completedTasks: string;
    pendingTasks: string;
    journalEntries: string;
    weeklyRate: string;
    tooltipCompleted: (c: number) => string;
    tooltipTotal: (t: number) => string;
    tooltipJournalWritten: string;
  };
  inbox: {
    title: string;
    subtitle: string;
    addUnscheduled: string;
    emptyTitle: string;
    emptyDesc: string;
    unscheduledColumnTitle: string;
    scheduledColumnTitle: string;
    noScheduledTasks: string;
    noScheduledDesc: string;
  };
  dateDrawer: {
    stationeryMood: string;
    progress: string;
    completedPct: (rate: number) => string;
    tasksHeader: (count: number) => string;
    addTask: string;
    noTasks: string;
    addTaskForDate: string;
    journalPreview: string;
    editEntry: string;
    writeEntry: string;
    untitledEntry: string;
    noTextContent: string;
    noJournalForDay: string;
  };
  todo: {
    completedCount: (count: number) => string;
    unscheduled: string;
    clearInbox: string;
    cancel: string;
    deleteTask: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  en: {
    siteName: '木漏れ日',
    subTitle: 'Personal Journal',
    nav: {
      calendar: 'Calendar',
      inbox: 'Inbox',
      journal: 'Journal',
      statistics: 'Statistics',
      settings: 'Settings',
    },
    header: {
      quickAdd: 'Quick Add',
      task: 'Task',
      today: 'Today:',
    },
    settings: {
      title: 'Settings & Data Management',
      subtitle: 'Local-first privacy. Manage backups, imports, and interface language.',
      languageSection: 'Interface Language',
      languageDesc: 'Choose your preferred language for the application interface.',
      languages: {
        en: 'English',
        zh: '中文',
        ja: '日本語',
      },
      backupSection: 'Local Backup & Restore',
      backupDesc:
        'Your journal and task data is stored directly in your browser using IndexedDB. You can export a JSON backup file at any time to keep a local offline copy.',
      exportBtn: 'Export Backup (JSON)',
      importBtn: 'Import Backup File',
      resetSection: 'Data Reset',
      resetDesc:
        'Permanently clear all tasks and journal entries from your browser. Make sure you have exported a backup beforehand.',
      clearBtn: 'Clear All Local Data',
      confirmImportTitle: 'Confirm Import',
      confirmImportDesc: (todos, entries) =>
        `Found ${todos} todos and ${entries} journal entries in this backup file.`,
      mergeBtn: 'Merge with Existing Data',
      overwriteBtn: 'Overwrite Existing Data Completely',
      cancelBtn: 'Cancel',
      confirmClearTitle: 'Are you sure?',
      confirmClearDesc:
        'This action will delete all your local tasks and journal entries. It cannot be undone.',
      yesDeleteAll: 'Yes, Delete Everything',
    },
    quickAddModal: {
      title: 'Add New Task',
      taskTitlePlaceholder: 'Task Title...',
      taskDescPlaceholder: 'Optional description or notes...',
      dateLabel: 'Date / Schedule',
      inboxOption: 'Inbox (No Date)',
      priorityLabel: 'Priority',
      priorities: {
        high: 'High',
        medium: 'Medium',
        low: 'Low',
      },
      tagsPlaceholder: 'Tags (comma separated)...',
      save: 'Save Task',
      cancel: 'Cancel',
    },
    calendar: {
      viewMonth: 'Month',
      viewWeek: 'Week',
      viewDay: 'Day',
      today: 'Today',
      noTasks: 'No tasks scheduled for this day.',
      completed: 'Completed',
      addTask: 'Add Task',
    },
    journal: {
      newEntry: 'New Entry',
      searchPlaceholder: 'Search journal entries...',
      noEntries: 'No journal entries found.',
      writeFirst: 'Start writing your thoughts today.',
      saveEntry: 'Save Entry',
      back: 'Back',
      mood: 'Mood:',
      addTag: 'Add tag...',
      titlePlaceholder: "Today's Journal Title...",
      deleteTitle: 'Delete entry',
      entriesCount: (count: number) => `${count} ${count === 1 ? 'entry' : 'entries'}`,
      noMatchingEntries: 'No matching entries.',
      adjustQueryOrFilters: 'Try adjusting your query or filters.',
    },
    statistics: {
      title: 'Personal Progress',
      subtitle: 'Reflecting on your consistency, tasks, and mindfulness.',
      streak: 'Days Streak',
      streakActive: 'Active momentum',
      todaySummary: "Today's Summary",
      completionRate: 'Completion Rate',
      tasksDone: 'Tasks Done',
      journalWritten: 'Journal Entry',
      weeklyActivity: 'Last 7 Days Activity',
      completedTasksPerDay: 'Completed tasks per day',
      monthlyOverview: 'Monthly Overview',
      completedTasks: 'Completed Tasks',
      pendingTasks: 'Pending Tasks',
      journalEntries: 'Journal Entries',
      weeklyRate: 'Reflecting on your consistency, tasks, and mindfulness.',
      tooltipCompleted: (c: number) => `Completed: ${c} tasks`,
      tooltipTotal: (t: number) => `Total: ${t} tasks`,
      tooltipJournalWritten: '✓ Journal Written',
    },
    inbox: {
      title: 'Inbox & Scheduled Tasks',
      subtitle: 'Manage all unscheduled inbox items and upcoming dated tasks in one place.',
      addUnscheduled: 'Add Unscheduled Task',
      emptyTitle: 'Nothing waiting here.',
      emptyDesc: 'Your Inbox is completely clear.',
      unscheduledColumnTitle: 'Unscheduled Tasks (Inbox)',
      scheduledColumnTitle: 'Scheduled Tasks',
      noScheduledTasks: 'No scheduled tasks',
      noScheduledDesc: 'Tasks with assigned dates will appear here ordered by date.',
    },
    dateDrawer: {
      stationeryMood: 'Stationery Mood: Quiet Calm',
      progress: 'Progress',
      completedPct: (rate: number) => `${rate}% Completed`,
      tasksHeader: (count: number) => `Tasks (${count})`,
      addTask: 'Add Task',
      noTasks: 'No tasks scheduled.',
      addTaskForDate: 'Add a task for this date.',
      journalPreview: 'Journal Preview',
      editEntry: 'Edit Entry',
      writeEntry: 'Write Entry',
      untitledEntry: 'Untitled Entry',
      noTextContent: 'No text content.',
      noJournalForDay: 'No journal entry written for this day.',
    },
    todo: {
      completedCount: (count: number) => `Completed (${count})`,
      unscheduled: 'No Date',
      clearInbox: 'Set No Date',
      cancel: 'Cancel',
      deleteTask: 'Delete task',
    },
  },
  zh: {
    siteName: '木漏れ日',
    subTitle: '个人日历与日志',
    nav: {
      calendar: '日历',
      inbox: '收集箱',
      journal: '日志',
      statistics: '统计',
      settings: '设置',
    },
    header: {
      quickAdd: '快速添加',
      task: '任务',
      today: '今天:',
    },
    settings: {
      title: '设置与数据管理',
      subtitle: '本地离线优先，保护隐私。管理备份、导入与界面语言。',
      languageSection: '界面语言',
      languageDesc: '选择您偏好的应用界面显示语言。',
      languages: {
        en: 'English',
        zh: '中文',
        ja: '日本語',
      },
      backupSection: '本地备份与恢复',
      backupDesc:
        '您的日志与任务数据通过 IndexedDB 直接保存在浏览器本地。您可以随时导出 JSON 备份文件以便离线保存或多设备迁移。',
      exportBtn: '导出备份 (JSON)',
      importBtn: '导入备份文件',
      resetSection: '数据重置',
      resetDesc:
        '永久清除浏览器中的所有任务与日志记录。请在操作前确保已导出备份。',
      clearBtn: '清除所有本地数据',
      confirmImportTitle: '确认导入',
      confirmImportDesc: (todos, entries) =>
        `在此备份文件中找到 ${todos} 个任务和 ${entries} 篇日志记录。`,
      mergeBtn: '与现有数据合并',
      overwriteBtn: '完全覆盖现有数据',
      cancelBtn: '取消',
      confirmClearTitle: '您确定要删除吗？',
      confirmClearDesc:
        '此操作将永久删除所有本地任务与日志记录，无法撤销。',
      yesDeleteAll: '是的，删除所有数据',
    },
    quickAddModal: {
      title: '添加新任务',
      taskTitlePlaceholder: '任务标题...',
      taskDescPlaceholder: '可选描述或备注...',
      dateLabel: '日期 / 计划',
      inboxOption: '收集箱 (无日期)',
      priorityLabel: '优先级',
      priorities: {
        high: '高',
        medium: '中',
        low: '低',
      },
      tagsPlaceholder: '标签 (逗号分隔)...',
      save: '保存任务',
      cancel: '取消',
    },
    calendar: {
      viewMonth: '月',
      viewWeek: '周',
      viewDay: '日',
      today: '今天',
      noTasks: '今日暂无安排任务。',
      completed: '已完成',
      addTask: '添加任务',
    },
    journal: {
      newEntry: '新建日志',
      searchPlaceholder: '搜索日志记录...',
      noEntries: '未找到相关日志。',
      writeFirst: '开启今天的文字记录吧。',
      saveEntry: '保存日志',
      back: '返回',
      mood: '心情:',
      addTag: '添加标签...',
      titlePlaceholder: '今天的日志标题...',
      deleteTitle: '删除日志',
      entriesCount: (count: number) => `${count} 篇日志`,
      noMatchingEntries: '未找到匹配的日志。',
      adjustQueryOrFilters: '尝试调整您的搜索关键词或筛选条件。',
    },
    statistics: {
      title: '个人成长进度',
      subtitle: '回顾您的习惯坚持、任务完成与心流时刻。',
      streak: '天连续打卡',
      streakActive: '保持连胜势头',
      todaySummary: '今日概览',
      completionRate: '完成率',
      tasksDone: '完成任务',
      journalWritten: '今日日志',
      weeklyActivity: '近 7 天活动记录',
      completedTasksPerDay: '每日完成任务数量',
      monthlyOverview: '月度总览',
      completedTasks: '已完成任务',
      pendingTasks: '待办任务',
      journalEntries: '日志篇数',
      weeklyRate: '回顾您的习惯坚持、任务完成与心流时刻。',
      tooltipCompleted: (c: number) => `已完成: ${c} 个任务`,
      tooltipTotal: (t: number) => `共计: ${t} 个任务`,
      tooltipJournalWritten: '✓ 已撰写日志',
    },
    inbox: {
      title: '收集箱与任务全览',
      subtitle: '在一处统一管理无日期的收集箱任务与按日期排期的所有任务。',
      addUnscheduled: '添加任务',
      emptyTitle: '无日期收集箱目前为空',
      emptyDesc: '您的收集箱非常干净，没有等待处理的无日期任务。',
      unscheduledColumnTitle: '未安排日期的任务',
      scheduledColumnTitle: '已安排日期的任务',
      noScheduledTasks: '暂无已安排日期的任务',
      noScheduledDesc: '有安排日期的任务将按照日期从上到下的顺序排列在这里。',
    },
    dateDrawer: {
      stationeryMood: '手账氛围：静谧平稳',
      progress: '完成进度',
      completedPct: (rate: number) => `${rate}% 已完成`,
      tasksHeader: (count: number) => `任务列表 (${count})`,
      addTask: '添加任务',
      noTasks: '暂无安排任务。',
      addTaskForDate: '为该日期添加一个任务。',
      journalPreview: '日志预览',
      editEntry: '编辑日志',
      writeEntry: '写日志',
      untitledEntry: '无标题日志',
      noTextContent: '无文字内容。',
      noJournalForDay: '当天尚未撰写日志。',
    },
    todo: {
      completedCount: (count: number) => `已完成 (${count})`,
      unscheduled: '无日期',
      clearInbox: '设为无日期',
      cancel: '取消',
      deleteTask: '删除任务',
    },
  },
  ja: {
    siteName: '木漏れ日',
    subTitle: 'パーソナルジャーナル',
    nav: {
      calendar: 'カレンダー',
      inbox: 'インボックス',
      journal: '日誌',
      statistics: '統計',
      settings: '設定',
    },
    header: {
      quickAdd: 'クイック追加',
      task: 'タスク',
      today: '今日:',
    },
    settings: {
      title: '設定とデータ管理',
      subtitle: 'ローカルファーストのプライバシー保護。バックアップ、インポート、言語設定。',
      languageSection: '表示言語',
      languageDesc: 'アプリケーションの表示言語を選択してください。',
      languages: {
        en: 'English',
        zh: '中文',
        ja: '日本語',
      },
      backupSection: 'ローカルバックアップと復元',
      backupDesc:
        '日誌やタスクのデータはIndexedDBを使用してブラウザ内に直接保存されます。いつでもJSON形式でバックアップをエクスポートできます。',
      exportBtn: 'バックアップをエクスポート (JSON)',
      importBtn: 'バックアップファイルをインポート',
      resetSection: 'データリセット',
      resetDesc:
        'ブラウザからすべてのタスクと日誌を永久に削除します。事前にバックアップをエクスポートしてください。',
      clearBtn: 'すべてのローカルデータを削除',
      confirmImportTitle: 'インポートの確認',
      confirmImportDesc: (todos, entries) =>
        `バックアップファイル内に ${todos} 個のタスクと ${entries} 件の日誌が見つかりました。`,
      mergeBtn: '既存のデータと統合',
      overwriteBtn: '既存のデータを完全上書き',
      cancelBtn: 'キャンセル',
      confirmClearTitle: '本当に削除しますか？',
      confirmClearDesc:
        'この操作により、すべてのローカルタスクと日誌が削除されます。元に戻すことはできません。',
      yesDeleteAll: 'はい、すべて削除します',
    },
    quickAddModal: {
      title: '新しいタスクを追加',
      taskTitlePlaceholder: 'タスクのタイトル...',
      taskDescPlaceholder: '説明やメモ（任意）...',
      dateLabel: '日付 / スケジュール',
      inboxOption: 'インボックス (日付なし)',
      priorityLabel: '優先度',
      priorities: {
        high: '高',
        medium: '中',
        low: '低',
      },
      tagsPlaceholder: 'タグ (カンマ区切り)...',
      save: 'タスクを保存',
      cancel: 'キャンセル',
    },
    calendar: {
      viewMonth: '月',
      viewWeek: '週',
      viewDay: '日',
      today: '今日',
      noTasks: 'この日に予定されているタスクはありません。',
      completed: '完了',
      addTask: 'タスクを追加',
    },
    journal: {
      newEntry: '新しい日誌',
      searchPlaceholder: '日誌を検索...',
      noEntries: '日誌が見つかりません。',
      writeFirst: '今日の思いを書き始めましょう。',
      saveEntry: '日誌を保存',
      back: '戻る',
      mood: '気分:',
      addTag: 'タグを追加...',
      titlePlaceholder: '今日のタイトル...',
      deleteTitle: '日誌を削除',
      entriesCount: (count: number) => `${count} 件のエントリー`,
      noMatchingEntries: '一致する日誌が見つかりません。',
      adjustQueryOrFilters: '検索キーワードやフィルターを変更してみてください。',
    },
    statistics: {
      title: '個人の成長進捗',
      subtitle: '継続性、タスク完了、マインドフルネスの振り返り。',
      streak: '日連続',
      streakActive: 'アクティブな継続モーメンタム',
      todaySummary: '今日のサマリー',
      completionRate: '完了率',
      tasksDone: '完了タスク数',
      journalWritten: '日誌記入',
      weeklyActivity: '過去7日間のアクティビティ',
      completedTasksPerDay: '1日あたりの完了タスク数',
      monthlyOverview: '月間概要',
      completedTasks: '完了タスク',
      pendingTasks: '未完了タスク',
      journalEntries: '日誌エントリー',
      weeklyRate: '継続性、タスク完了、マインドフルネスの振り返り。',
      tooltipCompleted: (c: number) => `完了: ${c} 件のタスク`,
      tooltipTotal: (t: number) => `合計: ${t} 件のタスク`,
      tooltipJournalWritten: '✓ 日誌記入済み',
    },
    inbox: {
      title: 'インボックスと予定タスク',
      subtitle: '日付未設定のインボックスタスクと日付設定済みのタスクを一覧管理できます。',
      addUnscheduled: 'タスクを追加',
      emptyTitle: '未処理のタスクはありません',
      emptyDesc: 'インボックスはすべてクリアされています。',
      unscheduledColumnTitle: '日付未設定のタスク',
      scheduledColumnTitle: '日付設定済みのタスク',
      noScheduledTasks: '日付設定済みのタスクはありません',
      noScheduledDesc: '日付が設定されたタスクはここに日付順で表示されます。',
    },
    dateDrawer: {
      stationeryMood: '手帳のムード：穏やかで静か',
      progress: '進捗状況',
      completedPct: (rate: number) => `${rate}% 完了`,
      tasksHeader: (count: number) => `タスク (${count})`,
      addTask: 'タスクを追加',
      noTasks: '予定タスクはありません。',
      addTaskForDate: 'この日付にタスクを追加。',
      journalPreview: '日誌プレビュー',
      editEntry: '日誌を編集',
      writeEntry: '日誌を書く',
      untitledEntry: '無題の日誌',
      noTextContent: '本文はありません。',
      noJournalForDay: 'この日の日誌は未記入です。',
    },
    todo: {
      completedCount: (count: number) => `完了 (${count})`,
      unscheduled: '日付なし',
      clearInbox: '日付なしに設定',
      cancel: 'キャンセル',
      deleteTask: 'タスクを削除',
    },
  },
};
