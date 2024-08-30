import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transfert',
  standalone: true,
  imports: [],
  templateUrl: './transfert.component.html',
  styleUrl: './transfert.component.css'
})
export class TransfertComponent implements OnInit {
  menuItems: any[] = [];

  ngOnInit() {
    this.menuItems = [
      {
        label: 'File',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            items: [
              { label: 'Project', icon: 'pi pi-fw pi-folder' },
              { label: 'Other', icon: 'pi pi-fw pi-external-link' }
            ]
          },
          { label: 'Open', icon: 'pi pi-fw pi-folder-open' },
          { label: 'Quit', icon: 'pi pi-fw pi-power-off' }
        ]
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          { label: 'Undo', icon: 'pi pi-fw pi-undo' },
          { label: 'Redo', icon: 'pi pi-fw pi-redo' }
        ]
      },
      {
        label: 'Help',
        icon: 'pi pi-fw pi-question',
        items: [
          { label: 'Contents', icon: 'pi pi-fw pi-book' },
          { label: 'Search', icon: 'pi pi-fw pi-search' }
        ]
      },
      {
        label: 'Quit',
        icon: 'pi pi-fw pi-power-off'
      }
    ];
  }
}
