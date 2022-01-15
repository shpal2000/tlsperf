

  <script>
    import { DataTable } from "carbon-components-svelte";
    import "carbon-components-svelte/css/white.css";
  </script>
  
  <DataTable
  size="short"
  expandable
  headers={[{ key: 'name', value: 'Name' }, { key: 'protocol', value: 'Protocol' }, { key: 'port', value: 'Port' }, { key: 'rule', value: 'Rule' }]}
  rows={[{ id: 'a', name: 'Load Balancer 3', protocol: 'HTTP', port: 3000, rule: 'Round robin' }, { id: 'b', name: 'Load Balancer 1', protocol: 'HTTP', port: 443, rule: 'Round robin' }, { id: 'c', name: 'Load Balancer 2', protocol: 'HTTP', port: 80, rule: 'DNS delegation' }, { id: 'd', name: 'Load Balancer 6', protocol: 'HTTP', port: 3000, rule: 'Round robin' }, { id: 'e', name: 'Load Balancer 4', protocol: 'HTTP', port: 443, rule: 'Round robin' }, { id: 'f', name: 'Load Balancer 5', protocol: 'HTTP', port: 80, rule: 'DNS delegation' }]}
  >
  <div slot="expanded-row" let:row>
      <div class="columns is-multiline is-mobile">
        <div class="column is-half">
          <div class="field">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="label is-small">Name</label>
            <div class="control">
              <input class="input is-small" type="text" placeholder="Text input">
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
          <button class="button is-small is-info" >Add</button>
        </div>
        <div class="control">
          <button class="button is-small is-light" >Cancel</button>
        </div>
      </div>
  </div>
  </DataTable>  
    
  <style>

  </style>