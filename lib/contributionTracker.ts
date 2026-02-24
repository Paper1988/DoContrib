export interface ContributionMetrics {
    userId: string
    documentId: string
    wordsAdded: number
    wordsDeleted: number
    editSessions: number
    totalTimeSpent: number // 分鐘
    lastContribution: Date
}

export class ContributionTracker {
    private metrics: Map<string, ContributionMetrics> = new Map()

    trackEdit(userId: string, documentId: string, wordsAdded: number, wordsDeleted: number) {
        const key = `${userId}-${documentId}`
        const existing = this.metrics.get(key) || {
            userId,
            documentId,
            wordsAdded: 0,
            wordsDeleted: 0,
            editSessions: 0,
            totalTimeSpent: 0,
            lastContribution: new Date(),
        }

        existing.wordsAdded += wordsAdded
        existing.wordsDeleted += wordsDeleted
        existing.lastContribution = new Date()

        this.metrics.set(key, existing)

        // 儲存到資料庫
        this.saveToDatabase(existing)
    }

    private async saveToDatabase(metrics: ContributionMetrics) {
        await fetch('/api/contributions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(metrics),
        })
    }

    getContributions(documentId: string): ContributionMetrics[] {
        return Array.from(this.metrics.values())
            .filter((m) => m.documentId === documentId)
            .sort((a, b) => b.wordsAdded - a.wordsAdded)
    }
}
