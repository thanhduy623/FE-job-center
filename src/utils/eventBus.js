// src/utils/eventBus.js
import mitt from 'mitt';

const emitter = mitt();

export const EventBus = {
    emit: emitter.emit,
    on: emitter.on,
    off: emitter.off,

    showLoading(message = 'Loading...') {
        emitter.emit('loading:show', message);
    },
    hideLoading() {
        emitter.emit('loading:hide');
    },

    showNotify(message, status = 'info') {
        emitter.emit('notify:show', { message, status });
    },

    confirm(message) {
        return new Promise(resolve => {
            const handler = (result) => {
                resolve(result);
                emitter.off('confirm:response', handler);
            };
            emitter.on('confirm:response', handler);
            emitter.emit('confirm:show', message);
        });
    }
};
