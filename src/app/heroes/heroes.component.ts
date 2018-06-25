import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {


  heroes: Hero[];


  getHeroes(): void {

    /**
     * of(HEROES) 会返回一个 Observable<Hero[]>，它会发出单个值，这个值就是这些模拟英雄的数组。
     * 调用 HttpClient.get<Hero[]>() 它也同样返回一个 Observable<Hero[]>，它也会发出单个值，这个值就是来自 HTTP 响应体中的英雄数组。
     */
    /**
     * Observable.subscribe() 进行订阅
     * 上一个版本把英雄的数组赋值给了该组件的 heroes 属性。 这种赋值是同步的，
     * 这里包含的假设是服务器能立即返回英雄数组或者浏览器能在等待服务器响应时冻结界面。
     * 当 HeroService 真的向远端服务器发起请求时，这种方式就行不通了。
     * 新的版本等待 Observable 发出这个英雄数组，这可能立即发生，也可能会在几分钟之后。
     * 然后，subscribe 函数把这个英雄数组传给这个回调函数，该函数把英雄数组赋值给组件的 heroes 属性。
     */
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }

  /**
   * 注入 HeroService
   * 往构造函数中添加一个私有的 heroService，其类型为 HeroService。
   * 1. 声明了一个私有 heroService 属性，2. 把它标记为一个 HeroService 的注入点。
   * 当 Angular 创建 HeroesComponent 时，依赖注入系统就会把
   * 这个 heroService 参数设置为 HeroService 的单例对象。
   * @param {HeroService} heroService
   */
  constructor(private heroService: HeroService) { }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    /**
     * 组件与 heroService.delete() 返回的 Observable 还完全没有关联。必须订阅它。
     * 如果你忘了调用 subscribe()，本服务将不会把这个删除请求发送给服务器。
     * 作为一条通用的规则，Observable 在有人订阅之前什么都不会做。
     */
    this.heroService.deleteHero(hero).subscribe();
  }

  /**
   * 你固然可以在构造函数中调用 getHeroes()，但那不是最佳实践。
   * 让构造函数保持简单，只做初始化操作，比如把构造函数的参数赋值给属性。
   * 构造函数不应该做任何事。 它肯定不能调用某个函数来向远端服务（比如真实的数据服务）发起 HTTP 请求。
   * 你应该改为在 ngOnInit 生命周期钩子中调用 getHeroes()，
   * 并且等 Angular 构造出 HeroesComponent 的实例之后，找个恰当的时机调用 ngOnInit。
   */
  ngOnInit() {
    this.getHeroes();
  }

}
