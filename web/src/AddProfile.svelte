<script>
    import { selectedNode } from './store.js';

    export let isActive;
    let Name = '';
    let SshIP = '';
    let SshUser = '';
    let SshPass = '';

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher ();

    async function onAddProfileSuccess () {

      const res = await fetch ('/api/profiles', {
        method: 'POST',
        body: JSON.stringify({
          Name,
          SshIP,
          SshUser,
          SshPass,
          ProfileGroup : $selectedNode.Name
        })
      });

      if (res.ok) {
        const json = await res.json();

        if (json.status == 0){
          dispatch ('addProfileSuccess', {Name: Name});
          isActive=false;
        } else {
          console.log(json);
          alert (JSON.stringify(json))
        }
      } else {
        console.log(res);
        alert (JSON.stringify(res))
      }
    }

</script>

<div class="modal {isActive ? 'is-active' : ''}">
    <div class="modal-card box">
      <header>
        <p class="modal-card-title">Add Profile</p>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">Name</label>
          <div class="control">
            <input class="input is-info" type="text" placeholder="Text input" bind:value={Name}>
          </div>
        </div>

        <div class="field">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">Type</label>
          <div class="select is-fullwidth is-info">
            <select class="">
              <option>Select Type</option>
              <option>TLS Client, TLS Server</option>
              <option>TLS Client Only</option>
              <option>TLS Server Only</option>
              <option>TCP Client, TCP Server</option>
              <option>TCP Client Only</option>
              <option>TCP Server Only</option>
            </select>
          </div>
        </div>

        <div class="field">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">Client Port</label>
          <div class="select is-fullwidth is-info">
            <select class="">
              <option>Select Port</option>
              <option>G1:N1:ens192</option>
              <option>G1:N1:ens224</option>
            </select>
          </div>
        </div>

        <div class="field">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">Server Port</label>
          <div class="select is-fullwidth is-info">
            <select class="">
              <option>Select Port</option>
              <option>G1:N1:ens192</option>
              <option>G1:N1:ens224</option>
            </select>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button class="button is-info" on:click={onAddProfileSuccess}>Add</button>
          </div>
          <div class="control">
            <button class="button is-info is-light" on:click={() => isActive=false}>Cancel</button>
          </div>
        </div>
      </section>
    </div>
</div>

<style>

</style>