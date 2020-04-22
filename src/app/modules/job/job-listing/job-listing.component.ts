import { Component, OnInit } from '@angular/core';
import { Job1ServiceService } from '../job-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { JobServiceService } from 'src/app/shared/services/job-service.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
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
  DefaultPageSize = 5;
  range;
  myJd = true;
  userList
  selectedUserId = ''
  sortByDate = 'desc'
  sidebarIndex = 2
  constructor(private loaderService:LoaderService,private commongJobService: JobServiceService , private jobService: Job1ServiceService, private toastr: ToastrService, private router: Router) {
    // this.commongJobService.getSideBarIndex().subscribe((sidebarIndex)=>{
    //   this.sidebarIndex = sidebarIndex
    //   alert(sidebarIndex)
    //   if(sidebarIndex === 2){
    //     this.myJd = true
    //   }else{
    //     this.myJd = false
    //   }
    //   this.refresh();
    // })
  }
  ngOnInit() {
    if(location.pathname == '/myJd'){
      this.myJd = true
      this.sidebarIndex = 2
    }else{
      this.myJd = false
      this.sidebarIndex = 1
    }
    const pageParams = {pageSize: this.DefaultPageSize, pageIndex: this.pageSelected, myJd: this.myJd,sortByDate: this.sortByDate};
    this.jobService.getAllJobs(pageParams).subscribe((jobs: any) => {
      this.jobs = jobs.ProfileList;
      this.length = jobs.TotalRecords;
      // this.range = `${0 + 1}-${this.jobs.length} of ${this.length}`;
      this.range = `1-${this.jobs.length} of ${this.length}`;
    });
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
    this.jobService.FetchUserDetails().subscribe((usersData: any)=>{
      if (usersData.StatusCode === 200) {
        this.userList = usersData.UsersList;
      }
    })
  }
  refresh() {
    this.selectedLocation = undefined;
    this.selectedExperience = undefined;
    this.selectedDesignation = undefined;
    this.selectedUserId = ''
    this.searchString = ''
    const pageParams = {pageSize: 2, pageIndex: 0, myJd: this.myJd,sortByDate:this.sortByDate};
    this.jobService.getAllJobs(pageParams).subscribe((jobs: any) => {
      this.jobs = jobs.ProfileList;
      this.length = jobs.TotalRecords;
      // this.range = `${this.pageSelected + 1}-${this.jobs.length} of ${this.length}`;
      this.range = `1-${this.jobs.length} of ${this.length}`;
    });
  }
  search() {
    this.jobs = []
    console.log(typeof this.selectedDesignation, 'selectedselectiponnnnnn')
    const paramObject = {
      locationId : (this.selectedLocation && this.selectedLocation !== 'undefined') ? this.selectedLocation : 0,
      experienceId : (this.selectedExperience && this.selectedExperience !== 'undefined') ? this.selectedExperience : 0,
      designationId : (this.selectedDesignation && this.selectedDesignation !== 'undefined') ? this.selectedDesignation : 0,
      pageSize: this.DefaultPageSize,
      pageIndex: 0,
      searchString: this.searchString ? this.searchString : '',
      myJd: this.myJd,
      sortByDate: this.sortByDate,
      selectedUserId: this.selectedUserId
    };
    this.pageSelected = 0
    this.filterProfile(paramObject);
  }
  filterProfile(paramObject) {
    console.log(paramObject,'paramobject',this.jobs.length,'this.jobs.length',this.length,'this.lengthddd')
    // if(this.jobs.length === this.length){
    //   return
    // }
    this.jobService.FetchFilteredProfiles(paramObject).subscribe((FilteredList: any) => {
      if (FilteredList.StatusCode === 200) {
        this.jobs.push(...FilteredList.ProfileList);
        console.log(this.jobs, 'jobsss')
        this.length = FilteredList.TotalRecords;
        const previousRecord = paramObject.pageIndex * paramObject.pageSize;
        // this.range = `${previousRecord + 1}-${previousRecord + this.jobs.length} of ${this.length}`;
        this.range = `1-${this.jobs.length} of ${this.length}`;
      }
    });
  }
  onUserChange(evn){
    console.log(evn, 'evnnnnn',this.selectedUserId, 'selected userrrr')
  }
  onPaginateChange(evn) {
    console.log(evn, 'evfvvnnn', this.DefaultPageSize, "this.DefaultPageSizedd")
    const paramObject = {
      locationId : (this.selectedLocation && this.selectedLocation !== 'undefined') ? this.selectedLocation : 0,
      experienceId : (this.selectedExperience && this.selectedExperience !== 'undefined') ? this.selectedExperience : 0,
      designationId : (this.selectedDesignation && this.selectedDesignation !== 'undefined') ? this.selectedDesignation : 0,
      pageIndex: evn.pageIndex !== undefined ? evn.pageIndex : evn - 1,
      pageSize: evn.pageSize ? evn.pageSize : this.DefaultPageSize,
      searchString: this.searchString ? this.searchString : '',
      myJd: this.myJd,
      selectedUserId:this.selectedUserId?this.selectedUserId:"",
      sortByDate:this.sortByDate
    };
    this.pageSelected = evn.pageIndex !== undefined ? evn.pageIndex : evn,
    this.DefaultPageSize = evn.pageSize ? evn.pageSize : this.DefaultPageSize;
    this.filterProfile(paramObject);
  }
  // activateClass(index){
  //   this.commongJobService.changeSideBarIndex(index)
  // }
  goToDetails(jobId) {
    this.loaderService.show();
    if(location.pathname.indexOf('myJd') > 0){
      this.router.navigate(['myJd/job-description/' + jobId]);
    }else{
      this.router.navigate(['allJd/job-description/' + jobId]);
    }

  }
  onScroll() {
    console.log('scrolled!!');
    let pageDetails = {pageIndex:this.pageSelected + 1};
    this.onPaginateChange(pageDetails)
  }
}
