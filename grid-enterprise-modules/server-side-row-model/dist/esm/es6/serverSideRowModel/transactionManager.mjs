var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Autowired, Bean, BeanStub, Events, PostConstruct, ServerSideTransactionResultStatus } from "@ag-grid-community/core";
let TransactionManager = class TransactionManager extends BeanStub {
    constructor() {
        super(...arguments);
        this.asyncTransactions = [];
    }
    postConstruct() {
        // only want to be active if SSRM active, otherwise would be interfering with other row models
        if (!this.gridOptionsService.isRowModelType('serverSide')) {
            return;
        }
    }
    applyTransactionAsync(transaction, callback) {
        if (this.asyncTransactionsTimeout == null) {
            this.scheduleExecuteAsync();
        }
        this.asyncTransactions.push({ transaction: transaction, callback: callback });
    }
    scheduleExecuteAsync() {
        const waitMillis = this.gridOptionsService.getAsyncTransactionWaitMillis();
        this.asyncTransactionsTimeout = window.setTimeout(() => {
            this.executeAsyncTransactions();
        }, waitMillis);
    }
    executeAsyncTransactions() {
        if (!this.asyncTransactions) {
            return;
        }
        const resultFuncs = [];
        const resultsForEvent = [];
        const transactionsToRetry = [];
        let atLeastOneTransactionApplied = false;
        this.asyncTransactions.forEach(txWrapper => {
            let result;
            const hasStarted = this.serverSideRowModel.executeOnStore(txWrapper.transaction.route, cache => {
                result = cache.applyTransaction(txWrapper.transaction);
            });
            if (!hasStarted) {
                result = { status: ServerSideTransactionResultStatus.StoreNotStarted };
            }
            else if (result == undefined) {
                result = { status: ServerSideTransactionResultStatus.StoreNotFound };
            }
            resultsForEvent.push(result);
            const retryTransaction = result.status == ServerSideTransactionResultStatus.StoreLoading;
            if (retryTransaction) {
                transactionsToRetry.push(txWrapper);
                return;
            }
            if (txWrapper.callback) {
                resultFuncs.push(() => txWrapper.callback(result));
            }
            if (result.status === ServerSideTransactionResultStatus.Applied) {
                atLeastOneTransactionApplied = true;
            }
        });
        // do callbacks in next VM turn so it's async
        if (resultFuncs.length > 0) {
            window.setTimeout(() => {
                resultFuncs.forEach(func => func());
            }, 0);
        }
        this.asyncTransactionsTimeout = undefined;
        // this will be empty list if nothing to retry
        this.asyncTransactions = transactionsToRetry;
        if (atLeastOneTransactionApplied) {
            this.valueCache.onDataChanged();
            this.eventService.dispatchEvent({ type: Events.EVENT_STORE_UPDATED });
        }
        if (resultsForEvent.length > 0) {
            const event = {
                type: Events.EVENT_ASYNC_TRANSACTIONS_FLUSHED,
                results: resultsForEvent
            };
            this.eventService.dispatchEvent(event);
        }
    }
    flushAsyncTransactions() {
        // the timeout could be missing, if we are flushing due to row data loaded
        if (this.asyncTransactionsTimeout != null) {
            clearTimeout(this.asyncTransactionsTimeout);
        }
        this.executeAsyncTransactions();
    }
    applyTransaction(transaction) {
        let res;
        const hasStarted = this.serverSideRowModel.executeOnStore(transaction.route, store => {
            res = store.applyTransaction(transaction);
        });
        if (!hasStarted) {
            return { status: ServerSideTransactionResultStatus.StoreNotStarted };
        }
        else if (res) {
            this.valueCache.onDataChanged();
            if (res.remove) {
                const removedRowIds = res.remove.map(row => row.id);
                this.selectionService.deleteSelectionStateFromParent(transaction.route || [], removedRowIds);
            }
            this.eventService.dispatchEvent({ type: Events.EVENT_STORE_UPDATED });
            return res;
        }
        else {
            return { status: ServerSideTransactionResultStatus.StoreNotFound };
        }
    }
};
__decorate([
    Autowired('rowNodeBlockLoader')
], TransactionManager.prototype, "rowNodeBlockLoader", void 0);
__decorate([
    Autowired('valueCache')
], TransactionManager.prototype, "valueCache", void 0);
__decorate([
    Autowired('rowModel')
], TransactionManager.prototype, "serverSideRowModel", void 0);
__decorate([
    Autowired('rowRenderer')
], TransactionManager.prototype, "rowRenderer", void 0);
__decorate([
    Autowired('selectionService')
], TransactionManager.prototype, "selectionService", void 0);
__decorate([
    PostConstruct
], TransactionManager.prototype, "postConstruct", null);
TransactionManager = __decorate([
    Bean('ssrmTransactionManager')
], TransactionManager);
export { TransactionManager };
