class Subject {

    /**
     * @type {any | undefined}
     */
    currentValue;

    /**
     *
     * @type {Map<number,Subscription>}
     */
    subscribers = new Map();

    nextId = 0;

    constructor(initialValue) {
        this.currentValue = initialValue;
        this.emit();
    }

    /**
     * Emits last values
     */
    emit() {
        this.subscribers.forEach(subscription => {
            subscription.callback(this.currentValue);
        })
    }

    /**
     *
     * @param callback {callback}
     * @returns {Subscription}
     */
    subscribe(callback) {
        ++this.nextId;
        const subscription = new Subscription(this.nextId, callback, this)
        this.subscribers.set(this.nextId, subscription);
        return subscription
    }

    numOfSubscribers() {
        return this.subscribers.size;
    }

    clearAllSubscribers() {
        this.subscribers.clear();
    }

    next(data) {
        this.currentValue = data;
        this.emit()
    }
}


class Subscription {
    /**
     * @type {number}
     */
    id

    /**
     * @type  {callback}
     */
    callback

    /**
     * @type {Subject}
     */
    subject

    /**
     *
     * @param id {number}
     * @param callback {callback}
     * @param subject {Subject}
     */
    constructor(id, callback, subject) {
        this.id = id;
        this.callback = callback;
        this.subject = subject;
    }

    unsubscribe() {

        if (this.subject.subscribers.has(this.id)) {
            this.subject.subscribers.delete(this.id)
        }
    }
}
