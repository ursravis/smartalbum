
import {Component,OnInit,OnDestroy,ElementRef} from '@angular/core'; 
import {ActivatedRoute,Router} from '@angular/router';
import {IProject} from './project';
import {SmartImage} from './SmartImage';
import {ProjectService} from './project.service';
import { Subscription }       from 'rxjs/Subscription';


//import {Cropper}  from 'cropperjs';

//var Cropper =require('cropperjs/dist/cropper.js');
//var Cropper=System.import("cropperjs");

@Component({templateUrl:'app/project/project-details.component.html'})
export class ProjectDetailsComponent implements OnInit,OnDestroy {
    pageTitle:string='Project Details';
    project:IProject;
    croppedImageSrc : any;
    showSelectedImage: boolean=false;
    selectedImageSrc: string;
    disableEdits: boolean=true;
     errorMessage: string;
     cropper:any;
     files:any[]=[];
     loading :boolean;
    private sub:Subscription;
      
    constructor(private _route:ActivatedRoute,private _router:Router,private elementRef: ElementRef,private _projectService :ProjectService)
    {

    }
ngOnInit():void{
    this.project=new IProject();
     this.sub = this._route.params.subscribe(
            params => {
                let id = +params['id'];
                if(id>0)
                {
                    this._projectService.getProject(id).subscribe(
            project => {this.project = project;},
            error => this.errorMessage = <any>error);
                }
                else{
                    this.project.projectId=-1;
                    this.project.projectName="New Project";
                     this.project.images=[];

                }
        });
}
OnSaveClick():void{
    this.loading=true;
    if(this.project.projectId>0)
    {
    this._projectService.updateProject(this.project)
    .then(()=>{
        this.loading=false;
        this.onBack();});
    }
    else{
        this._projectService.createProject(this.project) 
        .then(()=>{
        this.loading=false;
        this.onBack();});
    }
}
onBack():void{
    this._router.navigate(['projects']);
  
}
  ngOnDestroy() {
        this.sub.unsubscribe();
    }
 
onEditClick():void{

 if( this.cropper != null) 
 {   
    this.cropper.destroy();
 }
    
   let image = this.elementRef.nativeElement.querySelector('#selectedImage');
        // this.cropper = new Cropper(image, {
        // aspectRatio:1,
        // scalable:false,
        // dragMode:'move',
        // background:false,
        // autoCrop:false,
        // crop: function(e) {
        //     console.log(e.detail.x);
        //     console.log(e.detail.y);
        //     console.log(e.detail.width);
        //     console.log(e.detail.height);
        //     console.log(e.detail.rotate);
        //     console.log(e.detail.scaleX);
        //     console.log(e.detail.scaleY);
 
        // }
        // });
        this.disableEdits=false;
        //image.addEventListener('cropend',this.onShowCropped);
}
onCropClick():void{
    this.cropper.crop();
}
onShowCropped(): void{
         this.croppedImageSrc=  this.cropper.getCroppedCanvas().toDataURL();
          this.project.filesSrc.push(this.croppedImageSrc);
          document.getElementById("openModalButton").click();
             //let editedImage = this.elementRef.nativeElement.querySelector('#croppedImage');
             //editedImage.src=this.croppedImageSrc;
}
onZoomInClick():void{
    this.cropper.zoom(0.1);
}
onZoomOutClick():void{
    this.cropper.zoom(-0.1);
}
onRotateRightClick():void{
    this.cropper.rotate(90);
}
onRotateLeftClick():void{
    this.cropper.rotate(-90);
}

onMoveLeft():void{
this.cropper.move(-10, 0);
}
onMoveRight():void{
    this.cropper.move(10, 0);
}
onMoveUp():void{
    this.cropper.move(0, -10);
}
onMoveDown():void{
    this.cropper.move(0, 10);
}
onFlipHor():void{
this.cropper.scaleX(-1);
}
onFlipVirt():void{
    this.cropper.scaleY(-1);
}
onSelectImage(_selectedImageSrc:string):void{
    if( this.cropper != null)    
    {
    this.cropper.destroy();
    }
  this.showSelectedImage=true;
this.selectedImageSrc=_selectedImageSrc;
document.getElementById("openModalButton").click();
this.disableEdits=true;
}

    // This is called when the user selects new files from the upload button
    fileChange(input:any){

        // Loop through each picture file
        for (var i = 0; i < input.files.length; i++) {

            //this.files.push(input.files[i]);
            var file=input.files[i];

            // Create an img element and add the image file data to it
            var img = document.createElement("img");
            //img.src = window.URL.createObjectURL(input.files[i]);

            // Create a FileReader
            var reader = new FileReader();

            // Add an event listener to deal with the file when the reader is complete
            reader.addEventListener("load", (event: any) => {
                // Get the event.target.result from the reader (base64 of the image)
               img.src = event.target.result;
               // img.src =reader.result;

                // Resize the image
                //var resized_img = this.resize(img);
                var thumbNail=this.createThumbnail(img,64,file.type);
                var imageData=new SmartImage();
                imageData.thumbnailSrc=thumbNail;
                imageData.imageSrc=event.target.result;
                imageData.imageName=file.name;
                imageData.imageType=file.type;
                // Push the img src (base64 string) into our array that we display in our html template
                this.project.images.push(imageData);
            }, false);

            reader.readAsDataURL(input.files[i]);
        }
      
    }

        createThumbnail(img:any,MAX_Pixel:number=64,imageType:string='image/jpeg')
        {
        var canvas=document.createElement("canvas");


        var width = img.width;
        var height = img.height;
        var factor:number;
        if (width > height) {
           factor=MAX_Pixel/width;
        } else {
             factor=MAX_Pixel/height;
        }

        canvas.width=width*factor;
        canvas.height=height*factor;
        var ctx = canvas.getContext("2d");

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                var dataUrl = canvas.toDataURL(imageType); 
          
        
                return dataUrl;
        }
    resize (img:any, MAX_WIDTH:number = 300, MAX_HEIGHT:number = 300){
        var canvas = document.createElement("canvas");

        console.log("Size Before: " + img.src.length + " bytes");

        var width = img.width;
        var height = img.height;

        if (width > height) {
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, width, height);

        var dataUrl = canvas.toDataURL('image/jpeg');  
        // IMPORTANT: 'jpeg' NOT 'jpg'
        console.log("Size After:  " + dataUrl.length  + " bytes");
        return dataUrl;
    }

    createThumbsOnServer()
    {
        if(this.project != null)
        {       
            this.loading=true;    
            this._projectService.createThumb(this.project.projectId)
            .then(project=>
            this.onBack() 
            //this._router.navigate(['projects/'+this.project.projectId])
            );
        }
    }

}


