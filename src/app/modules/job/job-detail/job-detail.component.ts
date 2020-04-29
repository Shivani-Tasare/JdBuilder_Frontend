import { Component, OnInit, Directive, ChangeDetectorRef, ElementRef, ViewChild, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Job1ServiceService } from '../job-service.service';
import {MatChipInputEvent, MatDialog} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ThemePalette} from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { JobServiceService } from '../../../shared/services/job-service.service';
import { AdalService } from 'src/app/shared/services/adal.service';
import * as JSPdf from 'jspdf';
import html2canvas from 'html2canvas';
import { LoaderService } from 'src/app/shared/services/loader.service';
import htmlToPdfmake from 'html-to-pdfmake'
import pdfMake from 'pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { SmartServiceService } from 'src/app/services/smart-service.service';
import { JdDetails } from 'src/app/shared/models/jd-details';
import {  MatchingConsultants } from 'src/app/shared/models/matchingConsultants';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {
  jobDescriptionForm: FormGroup;
  mandatorySkills: FormArray;
  desiredSkills: FormArray;
  qualifications: FormArray;
  rolesAndResponsibility: FormArray;
  deletedSkills: string[] = [];
  deletedQualifications: string[] = [];
  deletedResponsiblities: string[] = [];
  deletedTags: string[] = [];
  designations: string[] = [];
  filteredDesignations: string[] = []
  experiences: string[] = [];
  locations: string[] = [];
  isDataFetched = false;
  reloading = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags = [];
  allTags = [];
  isEditJd = false;
  selectedDesignationName;
  selectedLocationName = [];
  selectedExperienceName;
  jobDetail;
  suggestedSkill = [];
  suggestedQualification = [];
  suggestedResponsibilities = [];
  suggestedSummary = []
  selectedIndex = 2
  isSameUser = false
  submitted = false;
  isDuplicateDesignation = false
  jdDetails : JdDetails[];
  emailSearch = new FormControl();
   candidateCountList = [  
    { id: 0 , range:'90 to 100' , count: 0 },
    { id: 1 , range:'80 to 90' , count: 0},
    { id: 2 , range:'70 to 80' , count: 0},
    { id: 3 , range:'< 70' , count:0 }
    ]	
  color: ThemePalette = 'primary';	
  isPrivateChecked = false;	
  disabled = false;

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('suggestedInput') suggestedInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('content', {}) content: ElementRef;
  capturedImage;
  candidatesCount: number[];
  matchingConsultants : MatchingConsultants[];
  url: string;
  filteredEmails: any;
  constructor(private loaderService: LoaderService,public dialog: MatDialog,@Inject(DOCUMENT) private document: Document, private formBuilder: FormBuilder, private jobService: Job1ServiceService, private toastr: ToastrService,private router: Router, private commonJobService: JobServiceService, private adalService:AdalService, private smartService:SmartServiceService ) {
  }
  public downloadPDF() {
    let loader = this.loaderService
    loader.show();
    let quotes = document.getElementById('content-pdf');
    html2canvas(document.getElementById('content-pdf'),{scrollY: -window.scrollY}).then(function(canvas) {
      
      var img = canvas.toDataURL("image/png");
     
      var doc = new JSPdf('p', 'pt', 'letter');
      for (var i = 0; i <= quotes.clientHeight/1450; i++) {
        var srcImg  = canvas;
        var sX      = 0;
        var sY      = 1450 *i; 
        var sWidth  = 1100;
        var sHeight = 1450;
        var dX      = 0;
        var dY      = 0;
        var dWidth  = 1100;
        var dHeight = 1450;

        let onePageCanvas = document.createElement("canvas");
        onePageCanvas.setAttribute('width', "1100");
        onePageCanvas.setAttribute('height', "1450");
        var ctx = onePageCanvas.getContext('2d');
        ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);
        var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

        var width         = onePageCanvas.width;
        var height        = onePageCanvas.clientHeight;

        if (i > 0) {
            doc.addPage(612, 791); 
        }
        
        doc.setPage(i+1);
        doc.addImage(canvasDataURL, 'PNG', 25, 20, (width*0.5), (height*0.5));

    }

      doc.save('testCanvas.pdf');
      loader.hide();
      });
  }
  public downloadPDF2(){
    let htmlContent =  this.document.getElementById('content-pdf')
    this.jobService.GeneratePDF({htmlContent:htmlContent.outerHTML}).subscribe((data:any)=>{
      let blob = new Blob([data.body], {
        type: 'application/pdf' 
     });
     var link = document.createElement('a');
     link.href = window.URL.createObjectURL(blob);
     link.download = 'samplePDFFile.pdf';
     link.click();
     window.URL.revokeObjectURL(link.href);
    })
  }
  public downloadPDF3(){
    let loader = this.loaderService
    
    var html = htmlToPdfmake(this.document.getElementById('content-pdf').outerHTML);
    
    var docDefinition = {
      content: [
        html
      ],
      styles:{
        'html-strong':{
          background:'yellow' 
        }
      }
    };
    var pdfDocGenerator = pdfMake.createPdf(docDefinition).download();
  }
  
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = [['90-100% '], ['80-90% '], ['70-80 %'],['<70 %']];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['#264d00', '#66cc00', '#b3ff66', '#ffa600'],
    },
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if ((document.body.scrollTop > 140 ||
    document.documentElement.scrollTop > 140) && document.getElementById('header')) {
      document.getElementById('header').classList.add('fixed-header');
    }
    if (document.documentElement.scrollTop < 1 && document.getElementById('header')) {
        document.getElementById('header').classList.remove('fixed-header');
      }
  }
  fixHeader() {
    document.getElementById('header').classList.add('fixed-header');
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
  }
  private _filter(value: any): string[] {
    const filterValue = value.Id ? value.Id.toLowerCase() : value.toLowerCase();
    return this.allTags.filter((option, index) => {
      return option.TagName.toLowerCase().includes(filterValue);
    });
  }
  ngOnInit() { 
    this.initLoad();
    if(window.location.href.includes('edit')){
      this.isEditJd=true;
    }
  else{
    this.isEditJd = false;
  }
  }
  onEdit(){
      this.router.navigate(['review-jd/job-description/edit/'+this.jobDetail.ProfileDetail.ProfileId]);
  }
  onCancel(){
    this.router.navigate(['myJd/job-description/'+this.jobDetail.ProfileDetail.ProfileId]);
  }
  onShare() {
    console.log("inside onshare");
    var x = document.getElementById("email");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }
   searchEmailOnKeypress(name){
    console.log(name);
    if(name != undefined){
      this.jobService.fetchEmailsByName(name).subscribe(res => {
        this.filteredEmails = res;
        
      })
    }
  }
  onSend(emailId) {
    this.isEditJd = false;
    console.log(emailId);
    this.url = this.document.URL
    console.log(this.url);
    this.jobService.shareJdByEmail(emailId, this.url).subscribe(res => {
      console.log(res);
      this.router.navigate(['myJd/job-description/'+this.jobDetail.ProfileDetail.ProfileId]);
    })
  }


  initLoad(){
    this.selectedLocationName = [];
    this.jobService.fetchProfiles(location.pathname.split('/').pop()).subscribe((jobDetail: any) => {
      if (jobDetail.StatusCode === 200) {
        if(this.adalService.userInfo.profile.oid === jobDetail.ProfileDetail.CreatedBy){
          this.isSameUser = true
        }
        this.isDataFetched = true;
        const defaultMandatorySkill = [];
        const defaultDesiredSkill = [];
        const defaultQualification = [];
        const defaultResponsibility = [];
        this.jobDetail = jobDetail
        jobDetail.ProfileDetail.SkillList.forEach((ele) => {
          if (ele.SkillTypeId === 1) {
            defaultMandatorySkill.push(this.createMandatorySkill(ele));
          } else {
            defaultDesiredSkill.push(this.createDesiredSkill(ele));
          }
        }
        );
        jobDetail.ProfileDetail.QualificationList.forEach((ele) => {
            ele.isEditing = false
            defaultQualification.push(this.createQualification(ele));
        });
        jobDetail.ProfileDetail.ResponsibilityList.forEach((ele) => {
          ele.isEditing = false
          ele.Responsibility = [ele.Responsibility,Validators.required]
          defaultResponsibility.push(this.formBuilder.group(ele));
      });
        this.tags = jobDetail.ProfileDetail.TagsList;
        this.isPrivateChecked = jobDetail.ProfileDetail.IsPrivate;	
        this.jobDescriptionForm = this.formBuilder.group({
          title: new FormControl(jobDetail.ProfileDetail.ProfileName),
          about: new FormControl(jobDetail.ProfileDetail.About, Validators.required),
          selectedDesignation: new FormControl(jobDetail.ProfileDetail.DesignationId, Validators.required),
          selectedDesignationN: new FormControl(jobDetail.ProfileDetail.DesignationName, Validators.required),
          selectedLocation: new FormControl(jobDetail.ProfileDetail.LocationId, Validators.required),
          selectedExperience: new FormControl(jobDetail.ProfileDetail.ExperienceId, Validators.required),
          desiredSkills: this.formBuilder.array(defaultDesiredSkill),
          mandatorySkills: this.formBuilder.array(defaultMandatorySkill),
          qualifications:  this.formBuilder.array(defaultQualification),
          rolesAndResponsibility: this.formBuilder.array(defaultResponsibility),
          tagsCtrl: new FormControl(''),
        });
        this.jobService.FetchExperienceList().subscribe((experiences: any) => {
          if (experiences.StatusCode === 200) {
            this.experiences = experiences.ExperienceMasterList;
            experiences.ExperienceMasterList.forEach((val) => {
              if (this.jobDescriptionForm && this.jobDescriptionForm.get('selectedExperience').value === val.Id) {
                this.selectedExperienceName = val.ExperienceName;
              }
            });
          }
        });
        this.jobService.FetchLocationList().subscribe((locations: any) => {
          if (locations.StatusCode === 200) {
            this.locations = locations.LocationMasterList;
            locations.LocationMasterList.forEach((val) => {
              if (this.jobDescriptionForm && this.jobDescriptionForm.get('selectedLocation').value.includes(val.Id)) {
                this.selectedLocationName.push(val.LocationName)
              }
            });
          }
        });

        this.jobService.FetchDesignationList().subscribe((designations: any) => {
          if (designations.StatusCode === 200) {
            this.designations = designations.DesignationList;
            this.filteredDesignations = designations.DesignationList;
            designations.DesignationList.forEach((val) => {
              if (this.jobDescriptionForm && this.jobDescriptionForm.get('selectedDesignation').value === val.Id) {
                this.selectedDesignationName = val.DesignationName;
                this.jobDescriptionForm.patchValue({selectedDesignationN: val.DesignationName})
                this.FetchProfileSummary({value:val.Id,viewValue:val.DesignationName})
              }
            });
          }
        });

      } else {
        this.jobDescriptionForm = this.formBuilder.group({
          title: new FormControl('Title of the job'),
          about: new FormControl('Summary of the job'),
          desiredSkill: this.formBuilder.array([ this.formBuilder.group(
            {SkillId: 0, SkillName: 'default D skill', SkillTypeId: 2, SkillTypeName: 'Desired' }
            )
          ]),
          mandatorySkills: this.formBuilder.array([ this.formBuilder.group(
            {SkillId: 0, SkillName: 'default M skill', SkillTypeId: 1, SkillTypeName: 'Mandatory' }
            )
          ]),
          qualifications:  this.formBuilder.array([ this.formBuilder.group({Id: 0, Name: 'default qualification'})]),
        });
      }
      this.jobService.FetchTagsList().subscribe((tags: any) => {
        if (tags.StatusCode === 200) {
          this.allTags = tags.ProfileTagsList;
          for (let index = 0; this.allTags.length > index ; index++) {
            for (let index2 = 0; this.tags.length > index2 ; index2++) {
              if (this.allTags[index].Id === this.tags[index2].Id) {
                this.allTags.splice(index, 1);
                index = 0;
                index2 = 0;
              }
            }
          }
          this.filteredTags = this.jobDescriptionForm.get("tagsCtrl").valueChanges
          .pipe(
            startWith(''),
            map(val => {
              if (val && val.length >= 2) {
                return this._filter(val);
              } else {
                return [];
              }
            } )
          );
        }
      });
    });
  }
  compareWithFunc = (a: any, b: any) => a == b;
  createMandatorySkill(newSkill): FormGroup {
    return this.formBuilder.group({
        isEditing: newSkill.isEditing?newSkill.isEditing:false,
        SkillId: newSkill.SkillId,
        SkillName: [newSkill.SkillName,Validators.required],
        SkillTypeId: newSkill.SkillTypeId,
        SkillTypeName : newSkill.SkillTypeName,
    });
  }
  createQualification(qualificationObj): FormGroup {
    qualificationObj.Name = [qualificationObj.Name,Validators.required]
    return this.formBuilder.group(qualificationObj);
  }
  createDesiredSkill(desiredSkill): FormGroup {
    return this.formBuilder.group({
      isEditing:desiredSkill.isEditing?desiredSkill.isEditing:false,
      SkillId: desiredSkill.SkillId,
      SkillName: [desiredSkill.SkillName,Validators.required],
      SkillTypeId: 2,
      SkillTypeName : 'Desired'
    });
  }
  addMandatorySkill(): void {
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    const newSkill = {
      isEditing:true,
      SkillId: 0,
      SkillName: '',
      SkillTypeId: 1,
      SkillTypeName : 'Mandatory'};
    this.mandatorySkills.push(this.createMandatorySkill(newSkill));
  }
  addDesiredSkill(): void {
    this.mandatorySkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    const newSkill = {
      isEditing:true,
      SkillId: 0,
      SkillName: '',
      SkillTypeId: 1,
      SkillTypeName : 'Desired'};
    this.mandatorySkills.push(this.createDesiredSkill(newSkill));
  }
  addQualification(): void {
    this.qualifications = this.jobDescriptionForm.get('qualifications') as FormArray;
    const obj = {Id: 0, Name: '',isEditing:true};
    this.qualifications.push(this.createQualification(obj));
  }
  addResponsibility(): void {
    this.rolesAndResponsibility = this.jobDescriptionForm.get('rolesAndResponsibility') as FormArray;
    const obj = {Id: '', Responsibility: ['',Validators.required],isEditing:true};
    this.rolesAndResponsibility.push(this.formBuilder.group(obj));
  }
  deleteSkill(deletedSkill, index) {
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    if (deletedSkill.SkillId.value !== 0) {
      this.deletedSkills.push(deletedSkill.SkillId.value);
    }
    this.mandatorySkills.removeAt(index);
  }
  deleteDesiredSkill(deletedSkill, index) {
    this.desiredSkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    if (deletedSkill.SkillId.value !== 0) {
      this.deletedSkills.push(deletedSkill.SkillId.value);
    }
    this.desiredSkills.removeAt(index);
  }
  deleteQualification(deletedQualification, index) {
    this.qualifications = this.jobDescriptionForm.get('qualifications') as FormArray;
    if (deletedQualification.Id.value !== 0) {
      this.deletedQualifications.push(deletedQualification.Id.value);
    }
    this.qualifications.removeAt(index);
  }
  deleteResponsiblity( deletedResponsibility, index: number) {
    this.rolesAndResponsibility = this.jobDescriptionForm.get('rolesAndResponsibility') as FormArray;
    if (deletedResponsibility.Id.value !== 0) {
      this.deletedResponsiblities.push(deletedResponsibility.Id.value);
    }
    this.rolesAndResponsibility.removeAt(index);
  }
  moveToDesired(selectedSkill, index) {
    const updatedSkill = {
      SkillId: selectedSkill.SkillId.value,
      SkillName: selectedSkill.SkillName.value
    };
    this.desiredSkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    this.desiredSkills.push(this.createDesiredSkill(updatedSkill));
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    this.mandatorySkills.removeAt(index);
  }
  moveToMandatory(selectedSkill, index) {
    const updatedSkill = {
      SkillId: selectedSkill.SkillId.value,
      SkillName: selectedSkill.SkillName.value,
      SkillTypeId: 1,
      SkillTypeName: 'Mandatory'
    };
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    this.mandatorySkills.push(this.createMandatorySkill(updatedSkill));
    this.desiredSkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    this.desiredSkills.removeAt(index);
  }
  
  add(event: MatChipInputEvent, isAdd): void {
    if (isAdd) {
      const input = event.input;
      const value = event.value;
      
      if ((value || '').trim()) {
        this.tags.push({Id: '', TagName: value.trim()});
      }
      
      if (input) {
        input.value = '';
      }
      this.tagsCtrl.setValue(null);
    }

  }

  
  viewCandidates(myModal : any){
     this.smartService.fetchCandidatesDetails(this.jobDetail.ProfileDetail.ProfileId).subscribe(
       response=>{
        this.matchingConsultants = response;
        this.filterCandidatesByMatchScore(this.matchingConsultants["MatchingConsultants"]);
  })
  }

  filterCandidatesByMatchScore(matchingConsultants : any[]){
    this.candidateCountList[0].count = matchingConsultants.filter((x)=>x.RelevancePercentage > 90).length;
    this.candidateCountList[1].count = matchingConsultants.filter((x)=>x.RelevancePercentage > 80 &&  x.RelevancePercentage <= 90).length;
    this.candidateCountList[2].count = matchingConsultants.filter((x)=>x.RelevancePercentage >= 70 &&  x.RelevancePercentage <= 80).length;
    this.candidateCountList[3].count = matchingConsultants.filter((x)=>x.RelevancePercentage < 70).length;
    this.pieChartData = this.candidateCountList.map(x => x.count);
  }

  removeTag(tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.allTags.push(tag);
      this.deletedTags.push(tag.Id);
    }
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.value);
    this.tagInput.nativeElement.value = '';
    this.allTags.filter((option, index) => {
      if (option.Id.toLowerCase().includes(event.option.value.Id)) {
        this.allTags.splice(index, 1);
      }
    });
    this.tagsCtrl.setValue(null);
  }
  selectedSkill(event: MatAutocompleteSelectedEvent,index,isMandatory): void{
    if(isMandatory){
      this.jobDescriptionForm.controls['mandatorySkills'].value[index].SkillName = event.option.value
    }else{
      this.jobDescriptionForm.controls['desiredSkills'].value[index].SkillName = event.option.value
    }
  }
  selectQualification(event: MatAutocompleteSelectedEvent,index,isMandatory): void{
      this.jobDescriptionForm.controls['qualifications'].value[index].Name = event.option.value
  }
  selectResponsibility(event: MatAutocompleteSelectedEvent,index,isMandatory): void{
      this.jobDescriptionForm.controls['rolesAndResponsibility'].value[index].Responsibility = event.option.value
  }
  getSkill(event){
    if(event.target.value.length >2){
      
      if((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90)){
        this.jobService.FetchAllSkills(event.target.value).subscribe((skillData: any)=>{
          if(skillData.StatusCode){
            this.suggestedSkill = skillData.Skills;
          }
        })
      }
    }
  }
  getQualifications(event){
    if(event.target.value.length >1){
      
      if((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90)){
        this.jobService.FetchAllQualifications(event.target.value).subscribe((Data: any)=>{
          if(Data.StatusCode){
            this.suggestedQualification = Data.ProfileQualifications;
          }
        })
      }
    }
  }
  getResponsibilities(event){
    if(event.target.value.length >1){
      
      if((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90)){
        this.jobService.FetchAllResponsibilities(event.target.value).subscribe((Data: any)=>{
          if(Data.StatusCode){
            this.suggestedResponsibilities = Data.ProfileResponsibilities;
          }
        })
      }
    }
  }
  
  FetchProfileSummary(designationEvent){
    
    this.selectedDesignationName = designationEvent.viewValue;
    this.jobDescriptionForm.patchValue({selectedDesignationN: designationEvent.viewValue})
    this.jobDescriptionForm.patchValue({selectedDesignation: designationEvent.value})
    let designationObject = {designationId:designationEvent.value,name:designationEvent.viewValue}
    this.jobService.FetchProfileSummary(designationObject).subscribe((Data: any)=>{
      if(Data.StatusCode){
        this.suggestedSummary = Data.ProfileSummary;
      }
    })
  }
  selectSuggestion(selectedSuggestion){
    this.jobDescriptionForm.patchValue({about: selectedSuggestion})
  }
  clearSummary(){
    this.jobDescriptionForm.patchValue({about: ""})
  }
  checkDuplicateDesignation(event){
    if(!isNaN(this.jobDescriptionForm.get('selectedDesignation').value)){
      this.isDuplicateDesignation = false
    }
    if(isNaN(this.jobDescriptionForm.get('selectedDesignation').value)){
      
      let isChecked = false
      this.designations.forEach((designation:any) => {

        if(!isChecked){
          if(designation.DesignationName.trim().toLowerCase() === event.target.value.trim().toLowerCase()){
            this.isDuplicateDesignation = true
            isChecked = true
          }else{
            this.isDuplicateDesignation = false
          }
        }
      });
    }
  }
  clearDesignationId(evnt){
    if((evnt.keyCode >= 48 && evnt.keyCode <= 57) || (evnt.keyCode >= 65 && evnt.keyCode <= 90)){
      this.jobDescriptionForm.patchValue({selectedDesignation: evnt.target.value})
    }
  }
  filterDesignationList(evnt){
    if((evnt.keyCode >= 48 && evnt.keyCode <= 57) || (evnt.keyCode >= 65 && evnt.keyCode <= 90) || evnt.keyCode === 8){
      if(evnt.target.value === ''){
        this.filteredDesignations = this.designations;
        return
      }
      this.filteredDesignations = this.designations.filter((designation: any)=>{
        let strRegExPattern = evnt.target.value;
        if(designation.DesignationName.match(new RegExp(strRegExPattern,'gi'))){
          return designation;
        }
      })
    }
  }
  deleteProfile(){
    this.jobService.deleteProfile(location.href.split('/')[location.href.split('/').length-1]).subscribe((data:any)=>{
      if(data.StatusCode === 200){
        this.router.navigate(['myJd']);
      }
    })
  }
  makePrivate(){
    this.jobService.PrivatizeProfile(location.href.split('/')[location.href.split('/').length-1]).subscribe((data:any)=>{
      if(data.StatusCode === 200){
        this.router.navigate(['myJd']);
      }
    })
  }
  onSave() {
    	
    this.submitted = true;
          
          if (this.jobDescriptionForm.invalid || this.tags.length<1 || this.isDuplicateDesignation) {
            return;
        }
    
    const jdObject = {
      ProfileId: location.pathname.split('/').pop(),
      ProfileName: this.jobDescriptionForm.get('title').value,
      About: this.jobDescriptionForm.get('about').value,
      DesignationId: this.jobDescriptionForm.get('selectedDesignation').value,
      LocationId: this.jobDescriptionForm.get('selectedLocation').value,
      ExperienceId: this.jobDescriptionForm.get('selectedExperience').value,
      SkillList: [...this.jobDescriptionForm.get('mandatorySkills').value, ...this.jobDescriptionForm.get('desiredSkills').value],
      QualificationList: this.jobDescriptionForm.get('qualifications').value,
      ResponsibilityList: this.jobDescriptionForm.get('rolesAndResponsibility').value,
      TagsList: this.tags,
      DeletedQualifications: this.deletedQualifications,
      DeletedSkills: this.deletedSkills,
      DeletedResponsibilities: this.deletedResponsiblities,
      DeletedTags: this.deletedTags,
      NewDesignation:isNaN(this.jobDescriptionForm.get('selectedDesignation').value)?this.jobDescriptionForm.get('selectedDesignation').value:undefined,	
      isPrivate:this.isPrivateChecked
        };
    this.jobService.saveJd(jdObject).subscribe((updatedData: any) => {
      if (updatedData.StatusCode === 200){

        this.toastr.success(updatedData.Message, 'Success');
        
        if(this.isSameUser){
          this.jobDetail.ProfileDetail.UpdatedDate = updatedData.ProfileDetail.UpdatedDate
          this.isEditJd = false
          document.body.scrollTop = 0; 
          document.documentElement.scrollTop = 0; 
          this.initLoad()
          this.router.navigate(['myJd/job-description/'+this.jobDetail.ProfileDetail.ProfileId]);
        }else{
          
          this.router.navigate(['myJd']);
        }

      }else{
        this.toastr.error(updatedData.Message, 'Error');
      }
    });
  }
}
