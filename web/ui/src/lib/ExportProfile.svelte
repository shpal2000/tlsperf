<script>

    import { selectedNode } from '$lib/store.js';
    import { ProgressBar } from "carbon-components-svelte";
    export let isActive;

    let JProfile;

    let isError;
    let errorMsg;
    let errorRows;
    let isProgress;

    let controller = null;
    let signal = null;
    let profilePromise = null;

    function resetState() {
      JProfile = '';

      isError = false;
      isProgress = false;

      isActive=false;

      profilePromise = null;
    }

    resetState();   

    function setErrorMsg(msg) {
      let lineRegex = new RegExp('\r?\n');

        errorMsg = msg;
        errorRows = (errorMsg.split(lineRegex)).length;
        if (errorRows == 0){
          errorRows = 1
        } else if (errorRows > 4){
          errorRows = 4;
        }
        isError = true;
    }

    async function onExportClose () {
      resetState ();

      if (controller) {
        controller.abort ();
      }
    }

    async function onExportFetch() {
      let Name = $selectedNode.Name;
      let Group = $selectedNode.ParentName;

      controller = new AbortController();
      signal = controller.signal;

      try {
          errorMsg = '';
          isError = false;
          isProgress = true;
          const res = await fetch (`/api/profiles.json?group=${Group}&name=${Name}`, {
            signal,
            method: 'GET'
          });
          isProgress = false;

          if (res.ok) {
            const text = await res.text();
            let isJson = true;
            let json = {};
            try {
              json = JSON.parse (text);
            } catch (e) {
              isJson = false;
            }

            if (isJson) {
              if (json.status == 0){
                JProfile = JSON.stringify(json.data);
              } else {
                console.log(json);
                setErrorMsg (json.message);
              }
            } else {
              setErrorMsg (text); 
            }
          } else {
            console.log(res);
            setErrorMsg (JSON.stringify(res));
          }
        } catch (e) {
          isProgress = false;
          setErrorMsg (e.toString()); 
        }
    }

</script>

<div class="modal {isActive ? 'is-active' : ''}">
    <div class="modal-background"></div>
    <div class="modal-card box ">
      <header>
        <p class="modal-card-title ">Profile Json</p>
      </header>
      <section class="modal-card-body">
        <div class="columns is-multiline is-mobile">

          <div class="column is-full">
            <div class="field">              
              <div class="control">
                <textarea class="textarea" placeholder="" rows="10" bind:value={JProfile} readonly/>
              </div>
            </div>
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
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="label">Error</label>
            <div class="control">
              <textarea class="textarea errmsg" placeholder="" rows="{errorRows}" value={errorMsg} readonly/>
            </div>
          </div>          
        {/if}

        <div class="field is-grouped">
          <div class="control">
            <button class="button  is-light" on:click={onExportFetch}>Fetch</button>
          </div>
          <div class="control">
            <button class="button  is-light" on:click={onExportClose}>Close</button>
          </div>
        </div>


      </section>
    </div>
</div>


<style>
  .errmsg {
    background-color: transparent;
    color: red;
    overflow: auto;
  }
</style>