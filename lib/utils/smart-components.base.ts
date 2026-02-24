import { useCallback, useEffect, useRef } from 'react'
import { SubSink } from 'subsink'

// 智能訂閱管理 hook
export function useSmartSubscriptions() {
    const subsRef = useRef(new SubSink())
    const subscriptionsRef = useRef<Set<any>>(new Set())

    // 自動清理所有訂閱
    useEffect(() => {
        return () => {
            subsRef.current.unsubscribe()
            subscriptionsRef.current.clear()
        }
    }, [])

    // 智能添加訂閱 - 自動追蹤並在組件卸載時清理
    const smartAdd = useCallback((subscription: any) => {
        subscriptionsRef.current.add(subscription)
        subsRef.current.add(subscription)
        return subscription
    }, [])

    // 智能設置單一訂閱
    const smartSet = useCallback((subscription: any) => {
        subsRef.current.sink = subscription
        subscriptionsRef.current.add(subscription)
        return subscription
    }, [])

    // 手動清理特定訂閱
    const smartRemove = useCallback((subscription: any) => {
        subscriptionsRef.current.delete(subscription)
        if (subscription && typeof subscription.unsubscribe === 'function') {
            subscription.unsubscribe()
        }
    }, [])

    // 清理所有訂閱
    const smartClear = useCallback(() => {
        subsRef.current.unsubscribe()
        subscriptionsRef.current.clear()
    }, [])

    return {
        smartAdd,
        smartSet,
        smartRemove,
        smartClear,
        addSub: smartAdd,
        sub: smartSet,
    }
}
