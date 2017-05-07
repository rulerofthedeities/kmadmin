import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ErrorService} from '../../services/error.service';
import {SyncService} from '../../services/sync.service';
import {Connection, Map, Collection, Profile} from '../../models/mongosync.model';

@Component({
  templateUrl: 'mongo-sync.component.html',
  styles: [`
    .colls{
      height: 250px;
      overflow-y: scroll;
    }
  `]
})
export class MongoSyncComponent implements OnInit {
  connForm: FormGroup;
  dbForm: FormGroup;
  connections: [Connection];
  profiles: [Profile];
  dbs: Map<string[]> = {};
  collLists: Map<string[]> = {};
  current: Profile = {name: '', source: {connId: ''}, target: {connId: ''}};
  compared_totals: {source: number, target: number} = {source: 0, target: 0};
  compared_docs: {toUpdate: any[], toAdd: any[], toDelete: any[]} =
    {toUpdate: [], toAdd: [], toDelete: []};
  show: {toUpdate: boolean, toAdd: boolean, toDelete: boolean} =
    {toUpdate: false, toAdd: false, toDelete: false};
  isCompared = false;

  constructor (
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private syncService: SyncService
  ) {}

  ngOnInit() {
    this.buildForms();
    this.getConnections();
    this.getProfiles();
  }

  buildForms() {
    this.connForm = this.formBuilder.group({
      'source': [''],
      'target': ['']
    });
    this.dbForm = this.formBuilder.group({
      'source': [''],
      'target': ['']
    });
  }

  getProfiles() {
    this.syncService
    .getProfiles()
    .subscribe(
      profiles => {this.profiles = profiles; },
      error => this.errorService.handleError(error)
    );
  }

  getConnections() {
    this.syncService
    .getConnections()
    .subscribe(
      connections => {this.connections = connections; },
      error => this.errorService.handleError(error)
    );
  }

  getDatabases(connTpe: string, connId: string, refresh: boolean = false) {
    this.current[connTpe].connId = connId;
    if (refresh || !this.dbs[connId]) {
      console.log('fetching list from mongo');
      this.syncService
      .getDatabases(connId)
      .subscribe(
        dbs => {
          this.dbs[connId] = dbs.map(db => db.name);
          this.current[connTpe].dbList = this.dbs[connId];
        },
        error => this.errorService.handleError(error)
      );
    } else {
      console.log('fetching list from cache');
      this.current[connTpe].dbList = this.dbs[connId];
    }
  }

  setTargetConn(connId: string) {
    this.current.target.connId = connId;
  }

  getCollections(connTpe: string, connId: string, dbName: string, refresh: boolean = false) {
    // this.current[connTpe].connId = connId;
    this.current[connTpe].dbName = dbName;
    if (refresh || !this.collLists[connTpe + '_' + dbName]) {
      this.syncService
      .getCollections(connId, dbName)
      .subscribe(
        collections => {
          const coll = collections.map(singleColl => singleColl.name);
          this.collLists[connTpe + '_' + dbName] = coll;
          this.current[connTpe].collList = coll;
        },
        error => this.errorService.handleError(error)
      );
    } else {
      this.current[connTpe].collList = this.collLists[connTpe + '_' + dbName];
    }
  }

  selectCollection(connTpe: string, collName: string) {
    this.current[connTpe].collName = collName;
  }

  compare() {
    this.syncService.compare(
      this.current.source.connId,
      this.current.target.connId,
      this.current.source.dbName,
      this.current.source.collName
    ).subscribe(
      data => {
        this.compared_totals = data.total;
        this.compared_docs = data.docs;
        this.isCompared = true;
      },
      error => this.errorService.handleError(error)
    );
  }

  showDocs(tpe) {
    this.show[tpe] = !this.show[tpe];
  }

  synch(tpe) {
    switch (tpe) {
      case 'toAdd':
        this.syncService.addDocuments(
          this.compared_docs[tpe],
          this.current.target.connId,
          this.current.source.dbName,
          this.current.source.collName
        ).subscribe(
          result => {this.compared_docs.toAdd = []; },
          error => this.errorService.handleError(error)
        );
      break;
      case 'toUpdate':
        this.syncService.updateDocuments(
          this.compared_docs[tpe],
          this.current.target.connId,
          this.current.source.dbName,
          this.current.source.collName
        ).subscribe(
          result => {this.compared_docs.toUpdate = []; },
          error => this.errorService.handleError(error)
        );
      break;
      case 'toDelete':
        this.compared_docs[tpe].forEach(
          doc => {
            this.syncService.removeDocument(
              doc._id,
              this.current.target.connId,
              this.current.source.dbName,
              this.current.source.collName
            ).subscribe(
              result => {this.compared_docs.toDelete = []; },
              error => this.errorService.handleError(error)
            );
          }
        );
      break;
    }
  }

  saveProfile(name: string) {
    if (name) {
      console.log('profile name:', name);
      const profile: Profile = {
        name,
        source: {
          connId: this.current['source'].connId,
          dbName: this.current['source'].dbName,
          collName: this.current['source'].collName
        },
        target: {
          connId: this.current['target'].connId,
        }
      };
      this.syncService.saveProfile(profile).subscribe(
        result => {console.log('saved profile', result); },
        error => this.errorService.handleError(error)
      );
    } else {
      console.log('No profile name entered');
    }
  }

  selectProfile(id: string) {
    this.isCompared = false;
    let selectedProfile = null;
    this.profiles.forEach(profile => {if (profile._id === id) {
      selectedProfile = profile;
    }});

    if (selectedProfile) {
      this.current = selectedProfile;
      this.connForm.patchValue({source: selectedProfile.source.connId});
      this.getDatabases('source', selectedProfile.source.connId);
      this.dbForm.patchValue({source: selectedProfile.source.dbName});
      this.getCollections('source', selectedProfile.source.connId, selectedProfile.source.dbName);
      this.current.source.collName = selectedProfile.source.collName;
      this.connForm.patchValue({target: selectedProfile.target.connId});
    }
  }
}
