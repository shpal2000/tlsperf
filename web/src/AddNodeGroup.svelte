<script>
    import { ProgressBar } from "carbon-components-svelte";

    export let isActive;
    let Name = '';
    let isError = false;
    let errorMsg = '';
    let isProgress = false;

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher ();

    function reset() {
      Name = '';
      isProgress = false;
      errorMsg = '';
      isError = false;
      isActive=false;
    }

    async function onAddNodeGroupCancel () {
      reset();
    }

    async function onAddNodeGroupOk () {
      errorMsg = '';
      isError = false;

      isProgress = true;
      const res = await fetch ('/api/node_groups', {
        method: 'POST',
        body: JSON.stringify({
          Name
        })
      });
      isProgress = false;

      if (res.ok) {
        const json = await res.json();

        if (json.status == 0){
          dispatch ('addNodeGroupSuccess', {Name: Name});
          
          reset();
        } else {
          console.log(json);
          errorMsg = json.message;
          isError = true;
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
        <p class="modal-card-title">Add Node Folder</p>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">Name</label>
          <div class="control">
            <input class="input is-info" type="text" placeholder="Text input" bind:value={Name}>
          </div>
        </div>

        {#if isProgress}
        <div class="field">
          <div class="control">
            <ProgressBar helperText=""/>
          </div>
        </div>
        {/if}

        {#if isError}
          <div class="field">
            <div class="control">
              <input class="input errmsg" placeholder="" value="{errorMsg}" readonly/>
            </div>
          </div>          
        {/if}

        <div class="field is-grouped">
          <div class="control">
            <button class="button is-info" on:click={onAddNodeGroupOk}>Add</button>
          </div>
          <div class="control">
            <button class="button is-info is-light" on:click={onAddNodeGroupCancel}>Cancel</button>
          </div>
        </div>
      </section>
    </div>
</div>

<style>
  .errmsg {
    border: none;
    background-color: transparent;
    color: red;
    resize: none;
    outline: none;
  }
</style>