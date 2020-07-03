import { Component } from '@angular/core';
import { Organization } from '../../../model/organization';
import { OrganizationsProvider } from '../../../providers/organizations/organizations';
import { ToastProvider } from '../../../providers/toast/toast';

@Component({
  selector: 'page-organizations-editor',
  templateUrl: 'organizations-editor.html',
})
export class OrganizationsEditorPage {

  organizations: Organization[];
  creating: boolean = false;

  constructor(
    private organizationsProvider: OrganizationsProvider,
    private toastProvider: ToastProvider,
  ) {
    organizationsProvider.listAll()
      .subscribe(os => this.organizations = os);
  }

  create(name: string) {
    this.organizationsProvider.create(new Organization(0, name))
      .subscribe(o => {
        this.organizations.push(o);
        this.creating = false;
      });
  }

  update(organization: Organization) {
    this.organizationsProvider.update(organization)
      .subscribe(() => this.toastProvider.show('Organization updated'));
  }
}
