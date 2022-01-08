import {writable} from 'svelte/store';

export const selectedNode = writable('');

export const sideStore = writable({
    NodeRoot : {
        Name: 'Traffic Nodes',
        expanded: false,
        MenuItems: ['Error!'],
        children: []
    },

    ProfileRoot : {
        Name: 'Traffic Profiles',
        expanded: false,
        MenuItems: ['Error!'],
        children: []
    }
});


