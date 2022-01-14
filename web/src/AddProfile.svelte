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
    <div class="modal-background"></div>
    <div class="modal-card box ">
      <header>
        <p class="modal-card-title is-small">New Profile</p>
      </header>
      <section class="modal-card-body">
        <div class="columns is-multiline is-mobile">
          <div class="column is-half">
            <div class="field">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label class="label is-small">Name</label>
              <div class="control">
                <input class="input is-small" type="text" placeholder="Text input" bind:value={Name}>
              </div>
            </div>
          </div>

          <div class="column is-half">
            <div class="field">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label class="label is-small">Type</label>
              <div class="select is-fullwidth is-small">
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
          </div>
          <br>
          <div class="column is-half">
            <div class="field">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label class="label is-small">Client Port</label>
              <div class="select is-fullwidth is-small">
                <select class="">
                  <option>Select Port</option>
                  <option>G1:N1:ens192</option>
                  <option>G1:N1:ens224</option>
                </select>
              </div>
            </div>
          </div>

          <div class="column is-half">
            <div class="field">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label class="label is-small">Server Port</label>
              <div class="select is-fullwidth is-small">
                <select class="">
                  <option>Select Port</option>
                  <option>G1:N1:ens192</option>
                  <option>G1:N1:ens224</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-small is-info" on:click={onAddProfileSuccess}>Add</button>
          </div>
          <div class="control">
            <button class="button is-small is-light" on:click={() => isActive=false}>Cancel</button>
          </div>
        </div>
      </section>
    </div>
</div>

<style>
  .modal-border {
    border: 1px solid lightskyblue;
  }
</style>