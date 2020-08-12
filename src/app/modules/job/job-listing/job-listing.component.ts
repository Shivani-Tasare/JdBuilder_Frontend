import { Component, OnInit } from '@angular/core';
import { Job1ServiceService } from '../job-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationExtras } from '@angular/router';
import { JobServiceService } from 'src/app/shared/services/job-service.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SmartServiceService } from 'src/app/services/smart-service.service';
import { MatchingConsultants } from 'src/app/shared/models/matchingConsultants';
import { Observable, Subject, forkJoin } from 'rxjs';
@Component({
  selector: 'app-job-listing',
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.scss']
})
export class JobListingComponent implements OnInit {
  jobs: any[] = [];
  experiences = [];
  locations = [];
  designations = [];
  selectedDesignation;
  selectedLocation;
  selectedExperience;
  searchString;
  // MatPaginator Inputs
  length = 100;
  pageSize = 2;
  pageSizeOptions: number[] = [2, 5, 10, 25, 100];
  pageSelected = 0;
  DefaultPageSize = 3;
  range;
  myJd = true;
  sharedJD = false;
  userList;
  selectedUserId = ''
  sortByDate = 'desc'
  sidebarIndex = 2
  associatedTags = [];
  constructor(private loaderService: LoaderService, private jobService: Job1ServiceService, private smartService: SmartServiceService, private toastr: ToastrService, private router: Router) {
  }
  ngOnInit() {
    if (location.pathname == '/jd-creator/myJd') {
      this.myJd = true
      this.sidebarIndex = 2
    } else if(location.pathname == '/jd-creator/jdsShared') {
      this.sharedJD = true;
      this.myJd = false;
    } else {
      this.myJd = false
      this.sidebarIndex = 1
    }
    this.initLoad();
    this.jobService.FetchExperienceList().subscribe((experiences: any) => {
      if (experiences.StatusCode === 200) {
        this.experiences = experiences.ExperienceMasterList;
      }
    });
    this.jobService.FetchLocationList().subscribe((locations: any) => {
      if (locations.StatusCode === 200) {
        this.locations = locations.LocationMasterList;
      }
    });
    this.jobService.FetchDesignationList().subscribe((designations: any) => {
      if (designations.StatusCode === 200) {
        this.designations = designations.DesignationList;
      }
    });
    this.jobService.FetchUserDetails().subscribe((usersData: any) => {
      if (usersData.StatusCode === 200) {
        this.userList = usersData.UsersList;
      }
    });
  }
 initLoad(){
   const pageParams = {
    locationId: (this.selectedLocation && this.selectedLocation !== 'undefined') ? this.selectedLocation : 0,
    experienceId: (this.selectedExperience && this.selectedExperience !== 'undefined') ? this.selectedExperience : 0,
    designationId: (this.selectedDesignation && this.selectedDesignation !== 'undefined') ? this.selectedDesignation : 0,
    pageSize: this.DefaultPageSize,
    pageIndex: 0,
    searchString: this.searchString ? encodeURIComponent(this.searchString) : '',
    myJd: this.myJd,
    sortByDate: this.sortByDate,
    selectedUserId: this.selectedUserId,
    sharedJD: this.sharedJD
   }
   this.fetchProfile(pageParams);
 }
  fetchProfile(paramObject) {
    this.jobService.FetchFilteredProfiles(paramObject).subscribe((FilteredList: any) => {
      if (FilteredList.StatusCode === 200) {
        this.associatedTags = [];
        (!!FilteredList.AssociatedTags) ? FilteredList.AssociatedTags.map((r,index)=> {
          if(index < 3) this.associatedTags.push({TagName: r});
        }) : null;
        this.jobs.push(...FilteredList.ProfileList);
        this.length = FilteredList.TotalRecords;
        const previousRecord = paramObject.pageIndex * paramObject.pageSize;
        this.range = `1-${this.jobs.length} of ${this.length}`;
      }
    });
  }

  refresh() {
    this.selectedLocation = undefined;
    this.selectedExperience = undefined;
    this.selectedDesignation = undefined;
    this.selectedUserId = ''
    this.searchString = ''
    const pageParams = {pageSize: 5, pageIndex: 0, myJd: this.myJd, sortByDate: this.sortByDate,sharedJD: this.sharedJD ,locationId: 0,
    experienceId : 0,designationId: 0, selectedUserId : '', searchString : ''}
    this.jobService.FetchFilteredProfiles(pageParams).subscribe((jobs: any) => {
          this.jobs = jobs.ProfileList;
          this.length = jobs.TotalRecords;
          this.range = `1-${this.jobs.length} of ${this.length}`;
    })
  }

  appendToMandatoryTags(index){
    this.searchString = (!!this.searchString) ? this.searchString + ', ' +
    this.associatedTags[index].TagName: this.associatedTags[index].TagName;
    this.associatedTags.splice(index, 1);
//    this.fetchAssociatedTags(this.mandatoryTagsList[this.mandatoryTagsList.length-1].TagName);
  }
  search(sort?) {
    this.jobs = []
    const pageParams = {
      locationId: (this.selectedLocation && this.selectedLocation !== 'undefined' && !sort) ? this.selectedLocation : 0,
      experienceId: (this.selectedExperience && this.selectedExperience !== 'undefined'  && !sort) ? this.selectedExperience : 0,
      designationId: (this.selectedDesignation && this.selectedDesignation !== 'undefined'  && !sort) ? this.selectedDesignation : 0,
      pageSize: this.DefaultPageSize,
      pageIndex: 0,
      searchString: (this.searchString && !sort) ? encodeURIComponent(this.searchString) : '',
      myJd: this.myJd,
      sortByDate: sort ? this.sortByDate : undefined,
      selectedUserId: sort ? '' : this.selectedUserId,
      sharedJD: this.sharedJD
     }
     this.fetchProfile(pageParams);

  }
  
  onUserChange(evn) {
  }
  onPaginateChange(evn) {
    const paramObject = {
      locationId: (this.selectedLocation && this.selectedLocation !== 'undefined') ? this.selectedLocation : 0,
      experienceId: (this.selectedExperience && this.selectedExperience !== 'undefined') ? this.selectedExperience : 0,
      designationId: (this.selectedDesignation && this.selectedDesignation !== 'undefined') ? this.selectedDesignation : 0,
      pageIndex: evn.pageIndex !== undefined ? evn.pageIndex : evn - 1,
      pageSize: evn.pageSize ? evn.pageSize : this.DefaultPageSize,
      searchString: this.searchString ? this.searchString : '',
      myJd: this.myJd,
      selectedUserId: this.selectedUserId ? this.selectedUserId : "",
      sortByDate: this.sortByDate,
      sharedJD: this.sharedJD
    };
    this.pageSelected = evn.pageIndex !== undefined ? evn.pageIndex : evn,
      this.DefaultPageSize = evn.pageSize ? evn.pageSize : this.DefaultPageSize;
    this.fetchProfile(paramObject);
  }
  goToDetails(jobId) {
    this.loaderService.show();
    if (location.pathname.indexOf('myJd') > 0) {
      this.router.navigate(['jd-creator/myJd/job-description/view/' + jobId]);
    } else if (location.pathname.indexOf('jdsShared') > 0) {
      this.router.navigate(['jd-creator/jd/job-description/edit/' + jobId],{queryParams:{IsSharedJd:'true'}});
    }
    else {
      this.router.navigate(['jd-creator/allJd/job-description/view/' + jobId]);
    }
  }


  onScroll() {
    let pageDetails = { pageIndex: this.pageSelected + 1 };
    this.onPaginateChange(pageDetails)
  }
}
